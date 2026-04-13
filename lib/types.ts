// Tipos e interfaces globales del proyecto

export interface HomeData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    animationStyle: 'typewriter' | 'fadeIn' | 'slideUp';
  };
  meta: {
    pageTitle: string;
    description: string;
    author?: string;
  };
}

export interface AppConfig {
  appName: string;
  version: string;
  locale: string;
  theme: 'light' | 'dark';
  author?: {
    name: string;
    document: string;
  };
}
