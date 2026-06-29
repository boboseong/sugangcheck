import { Code, ExternalLink, Play } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";

const youtubeUrl = "https://www.youtube.com/watch?v=-B0-1HWUqyA";
const youtubeEmbedUrl = "https://www.youtube.com/embed/-B0-1HWUqyA";
const repositoryUrl = "https://github.com/boboseong/sugangcheck";

export function AboutPage() {
  return (
    <section className="page">
      <PageHeader
        title="소개자료"
        description="수강신청 오류 점검 앱의 소개 영상과 저장소 주소입니다."
      />

      <section className="section" aria-labelledby="about-video-title">
        <h2 id="about-video-title">소개 영상</h2>
        <div className="about-media-layout">
          <div className="about-video">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              src={youtubeEmbedUrl}
              title="수강신청 오류 점검 소개 영상"
            />
          </div>
          <article className="card about-profile-card">
            <h2>부산광역시교육청 시간표지원단</h2>
            <p>교사 권보성</p>
          </article>
        </div>
      </section>

      <section className="section" aria-labelledby="about-links-title">
        <h2 id="about-links-title">주소</h2>
        <div className="about-link-grid">
          <a
            className="about-link-card"
            href={youtubeUrl}
            rel="noreferrer"
            target="_blank"
          >
            <Play size={24} aria-hidden="true" />
            <span>
              <strong>유튜브 소개 영상</strong>
              <span>{youtubeUrl}</span>
            </span>
            <ExternalLink size={18} aria-hidden="true" />
          </a>
          <a
            className="about-link-card"
            href={repositoryUrl}
            rel="noreferrer"
            target="_blank"
          >
            <Code size={24} aria-hidden="true" />
            <span>
              <strong>GitHub 저장소</strong>
              <span>{repositoryUrl}</span>
            </span>
            <ExternalLink size={18} aria-hidden="true" />
          </a>
        </div>
      </section>
    </section>
  );
}
