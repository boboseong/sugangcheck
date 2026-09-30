import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FeedbackBoardPage } from "./FeedbackBoardPage";
import type { FeedbackPostPage } from "../feedback/feedbackBoardApi";
import { appVersion } from "../state/projectMetaStore";

const apiMocks = vi.hoisted(() => ({
  listFeedbackPosts: vi.fn(),
  createFeedbackPost: vi.fn(),
  createFeedbackComment: vi.fn(),
  deleteFeedbackPost: vi.fn(),
  deleteFeedbackComment: vi.fn(),
  verifyFeedbackAdminKey: vi.fn()
}));

vi.mock("../feedback/feedbackBoardApi", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../feedback/feedbackBoardApi")>();

  return { ...actual, ...apiMocks };
});

const samplePage: FeedbackPostPage = {
  page: 1,
  pageSize: 20,
  total: 1,
  posts: [
    {
      id: "post-1",
      createdAt: "2026-09-30T03:41:38.655Z",
      nickname: "부산교사",
      content: "엑셀 내보내기가 편해요.",
      appVersion: "0.1.14",
      comments: [
        {
          id: "comment-1",
          postId: "post-1",
          createdAt: "2026-09-30T04:00:00.000Z",
          nickname: "운영자",
          content: "감사합니다!",
          isAdmin: true
        }
      ]
    }
  ]
};

describe("FeedbackBoardPage", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.values(apiMocks).forEach((mock) => mock.mockReset());
    apiMocks.listFeedbackPosts.mockResolvedValue(samplePage);
  });

  it("renders posts with threaded comments and the admin badge", async () => {
    render(<FeedbackBoardPage />);

    expect(await screen.findByText("엑셀 내보내기가 편해요.")).toBeInTheDocument();
    expect(screen.getByText("감사합니다!")).toBeInTheDocument();
    expect(screen.getByText("운영자", { selector: ".feedback-admin-badge" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "전체 글 (1)" })).toBeInTheDocument();
  });

  it("shows a new post at once and confirms it in the background", async () => {
    let confirmPost: (value: { id: string; createdAt: string }) => void = () => {};
    apiMocks.createFeedbackPost.mockReturnValue(
      new Promise((resolve) => {
        confirmPost = resolve;
      })
    );

    render(<FeedbackBoardPage />);
    await screen.findByText("엑셀 내보내기가 편해요.");

    fireEvent.change(screen.getByLabelText("닉네임"), {
      target: { value: "새 교사" }
    });
    fireEvent.change(screen.getByLabelText("내용"), {
      target: { value: "  잘 쓰고 있습니다.  " }
    });
    fireEvent.change(screen.getByLabelText("삭제용 비밀번호 (선택)"), {
      target: { value: "1234" }
    });
    fireEvent.click(screen.getByRole("button", { name: "등록" }));

    // Visible before the server has answered, and the form is already cleared.
    expect(screen.getByText("잘 쓰고 있습니다.")).toBeInTheDocument();
    expect(screen.getByText("등록 중…")).toBeInTheDocument();
    expect(screen.getByLabelText("내용")).toHaveValue("");
    expect(screen.getByRole("heading", { name: "전체 글 (2)" })).toBeInTheDocument();
    expect(apiMocks.createFeedbackPost).toHaveBeenCalledWith({
      id: expect.stringMatching(/^[A-Za-z0-9-]{8,64}$/),
      nickname: "새 교사",
      content: "잘 쓰고 있습니다.",
      appVersion,
      password: "1234",
      website: ""
    });
    expect(localStorage.getItem("sugangcheck.feedbackBoard.nickname")).toBe("새 교사");

    confirmPost({ id: "ignored", createdAt: "2026-09-30T05:00:00.000Z" });

    await waitFor(() => {
      expect(screen.queryByText("등록 중…")).not.toBeInTheDocument();
    });
    expect(screen.getByText("잘 쓰고 있습니다.")).toBeInTheDocument();
    await waitFor(() => {
      expect(apiMocks.listFeedbackPosts).toHaveBeenCalledTimes(2);
    });
  });

  it("keeps a post that failed to send and retries it with the same id", async () => {
    const { FeedbackBoardError } = await import("../feedback/feedbackBoardApi");
    apiMocks.createFeedbackPost
      .mockRejectedValueOnce(new FeedbackBoardError("timeout"))
      .mockResolvedValueOnce({ id: "ignored", createdAt: "2026-09-30T05:00:00.000Z" });

    render(<FeedbackBoardPage />);
    await screen.findByText("엑셀 내보내기가 편해요.");

    fireEvent.change(screen.getByLabelText("닉네임"), {
      target: { value: "새 교사" }
    });
    fireEvent.change(screen.getByLabelText("내용"), {
      target: { value: "다시 보내질 글" }
    });
    fireEvent.click(screen.getByRole("button", { name: "등록" }));

    expect(await screen.findByText(/등록하지 못했습니다/)).toBeInTheDocument();
    expect(screen.getByText("다시 보내질 글")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    await waitFor(() => {
      expect(apiMocks.createFeedbackPost).toHaveBeenCalledTimes(2);
    });
    const [first] = apiMocks.createFeedbackPost.mock.calls[0] ?? [];
    const [second] = apiMocks.createFeedbackPost.mock.calls[1] ?? [];
    expect(second.id).toBe(first.id);
    await waitFor(() => {
      expect(screen.queryByText(/등록하지 못했습니다/)).not.toBeInTheDocument();
    });
    expect(screen.getByText("다시 보내질 글")).toBeInTheDocument();
  });

  it("adds a comment under a post", async () => {
    apiMocks.createFeedbackComment.mockResolvedValue({
      id: "comment-2",
      createdAt: "2026-09-30T05:00:00.000Z",
      isAdmin: false
    });

    render(<FeedbackBoardPage />);
    await screen.findByText("엑셀 내보내기가 편해요.");

    fireEvent.click(screen.getByRole("button", { name: "댓글 달기" }));
    const commentForm = screen.getByLabelText("댓글 내용").closest("form");

    if (!commentForm) {
      throw new Error("comment form not found");
    }

    fireEvent.change(screen.getByLabelText("댓글 내용"), {
      target: { value: "저도 동의해요" }
    });
    fireEvent.change(
      commentForm.querySelector("input:not([type=hidden])") as HTMLInputElement,
      { target: { value: "동료교사" } }
    );
    fireEvent.click(screen.getByRole("button", { name: "댓글 등록" }));

    expect(screen.getByText("저도 동의해요")).toBeInTheDocument();
    await waitFor(() => {
      expect(apiMocks.createFeedbackComment).toHaveBeenCalledWith({
        id: expect.stringMatching(/^[A-Za-z0-9-]{8,64}$/),
        postId: "post-1",
        nickname: "동료교사",
        content: "저도 동의해요",
        adminKey: undefined,
        website: ""
      });
    });
  });

  it("deletes a post with its password", async () => {
    apiMocks.deleteFeedbackPost.mockResolvedValue(undefined);
    apiMocks.listFeedbackPosts
      .mockResolvedValueOnce(samplePage)
      .mockResolvedValue({ ...samplePage, total: 0, posts: [] });

    render(<FeedbackBoardPage />);
    await screen.findByText("엑셀 내보내기가 편해요.");

    fireEvent.click(screen.getByRole("button", { name: "글 삭제" }));
    fireEvent.change(screen.getByLabelText("삭제용 비밀번호"), {
      target: { value: "1234" }
    });
    fireEvent.click(screen.getByRole("button", { name: "삭제 확인" }));

    await waitFor(() => {
      expect(apiMocks.deleteFeedbackPost).toHaveBeenCalledWith({
        postId: "post-1",
        password: "1234",
        adminKey: undefined
      });
    });
    // Removed from the screen without waiting for the list to reload.
    await waitFor(() => {
      expect(screen.queryByText("엑셀 내보내기가 편해요.")).not.toBeInTheDocument();
    });
  });

  it("turns on admin mode after the key is verified and shows admin controls", async () => {
    apiMocks.verifyFeedbackAdminKey.mockResolvedValue(true);

    render(<FeedbackBoardPage />);
    await screen.findByText("엑셀 내보내기가 편해요.");

    fireEvent.click(screen.getByRole("button", { name: "운영자 모드 켜기" }));
    fireEvent.change(screen.getByLabelText("관리자 키"), {
      target: { value: "secret" }
    });
    fireEvent.click(screen.getByRole("button", { name: "확인" }));

    expect(await screen.findByRole("button", { name: "운영자 모드 끄기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "댓글 삭제" })).toBeInTheDocument();
    expect(localStorage.getItem("sugangcheck.feedbackBoard.adminKey")).toBe("secret");
  });

  it("rejects a wrong admin key", async () => {
    apiMocks.verifyFeedbackAdminKey.mockResolvedValue(false);

    render(<FeedbackBoardPage />);
    await screen.findByText("엑셀 내보내기가 편해요.");

    fireEvent.click(screen.getByRole("button", { name: "운영자 모드 켜기" }));
    fireEvent.change(screen.getByLabelText("관리자 키"), {
      target: { value: "wrong" }
    });
    fireEvent.click(screen.getByRole("button", { name: "확인" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "비밀번호가 맞지 않거나 삭제 권한이 없습니다."
    );
    expect(localStorage.getItem("sugangcheck.feedbackBoard.adminKey")).toBeNull();
  });

  it("falls back to the cached list when loading fails", async () => {
    localStorage.setItem(
      "sugangcheck.feedbackBoard.cache",
      JSON.stringify({ ...samplePage, fetchedAt: "2026-09-29T00:00:00.000Z" })
    );
    const { FeedbackBoardError } = await import("../feedback/feedbackBoardApi");
    apiMocks.listFeedbackPosts.mockRejectedValue(new FeedbackBoardError("network"));

    render(<FeedbackBoardPage />);

    // The cached list is on screen straight away, before the request settles.
    expect(screen.getByText("엑셀 내보내기가 편해요.")).toBeInTheDocument();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "마지막으로 불러온 목록을 보여드립니다."
    );
  });
});
