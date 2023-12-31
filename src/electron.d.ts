// electron.d.ts
export {};

declare global {
  interface Window {
    electron: {
      openExternal: (url: string) => void;
      sendAchievement: (achievementName: string) => void;
    };
  }
}
