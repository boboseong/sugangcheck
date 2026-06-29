type PageHeaderProps = {
  title: string;
  description: string;
  versionLabel?: string;
};

export function PageHeader({ title, description, versionLabel }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header__title-row">
        <h1>{title}</h1>
        {versionLabel ? (
          <span className="page-header__version">{versionLabel}</span>
        ) : null}
      </div>
      <p>{description}</p>
    </header>
  );
}
