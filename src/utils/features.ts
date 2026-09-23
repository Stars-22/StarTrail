import site from '../data/site.json';

/** 功能开关（§3.1），页面与导航共用 */
export const features = site.features;

/** 经历页三区块是否至少有一个开启（决定路由与导航是否生成） */
export const hasExperiencePage =
  features.skills || features.experience || features.awards;
