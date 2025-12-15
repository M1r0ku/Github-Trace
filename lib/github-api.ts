// GitHub API 工具函数

export interface GitHubCommitItem {
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author?: {
    login: string;
    id: number;
    type: string;
  };
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubCommitItem[];
}

// 检测输入是否为邮箱格式
export function isEmail(input: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
}

// 检测输入是否为有效的 GitHub 用户名格式
export function isValidUsername(input: string): boolean {
  // GitHub 用户名规则：字母数字和连字符，不能以连字符开头或结尾
  const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  return usernameRegex.test(input) && input.length >= 1 && input.length <= 39;
}

// 通过用户名查找邮箱
export async function findEmailsByUsername(username: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://api.github.com/search/commits?q=author:${username}&per_page=5&sort=author-date&order=desc`,
      {
        headers: {
          'Accept': 'application/vnd.github.text-match+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubSearchResponse = await response.json();
    const emails = new Set<string>();

    // 提取所有邮箱并进行去重
    data.items.forEach(item => {
      if (item.commit.author.email) {
        emails.add(item.commit.author.email);
      }
    });

    return Array.from(emails);
  } catch (error) {
    console.error('Error finding emails by username:', error);
    throw new Error('Failed to search commits for this username');
  }
}

// 通过邮箱查找用户名
export async function findUsernamesByEmail(email: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://api.github.com/search/commits?q=author-email:${encodeURIComponent(email)}&per_page=5&sort=author-date&order=desc`,
      {
        headers: {
          'Accept': 'application/vnd.github.text-match+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubSearchResponse = await response.json();
    const usernames = new Set<string>();

    // 同时提取 commit.author.name 和 author.login，并进行去重
    data.items.forEach(item => {
      // 提取提交作者名字
      if (item.commit.author.name) {
        usernames.add(item.commit.author.name);
      }
      
      // 提取用户登录名
      if (item.author?.login) {
        usernames.add(item.author.login);
      }
    });

    return Array.from(usernames);
  } catch (error) {
    console.error('Error finding usernames by email:', error);
    throw new Error('Failed to search commits for this email');
  }
}