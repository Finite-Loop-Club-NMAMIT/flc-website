import {
  userNavItems,
  organiserNavItems,
  adminNavItems,
} from "~/constants/navbar";

// TODO(Omkar): Add meta data
const siteMetaData = {
  title: "Finite Loop Club",
  shortTitle: "FLC",
  name: "Finite Loop Club",
  email: "",
  address: "",
  author: "FLC Tech Team",
} as const;

const teamTabs = ["2016", "2021", "2022", "2023", "2024", "Faculty"] as const;

const years = [2017, 2020, 2021, 2022, 2023, 2024] as const;

const userLinkNames = [
  "Instagram",
  "LinkedIn",
  "GitHub",
  "Portfolio",
  "Leetcode",
] as const;

export {
  userNavItems,
  organiserNavItems,
  adminNavItems,
  userLinkNames,
  teamTabs,
  years,
  siteMetaData,
};
