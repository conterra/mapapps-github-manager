/*
 * Copyright (C) con terra GmbH
 */

/** The parts of a GitHub repository search result the bundle relies on. */
export interface RepositorySearchResult {
    total_count: number;
    items: Repository[];
}

export interface Repository {
    id: number;
    name: string;
    description: string | null;
    homepage: string | null;
    html_url: string;
    releases_url: string;
    updated_at: string;
    stargazers_count: number;
    topics: string[];
    archived: boolean;
}

/** The parts of a GitHub release the bundle relies on. */
export interface Release {
    name: string | null;
    tag_name: string;
    draft: boolean;
    prerelease: boolean;
    assets: ReleaseAsset[];
}

export interface ReleaseAsset {
    name: string;
    browser_download_url: string;
}
