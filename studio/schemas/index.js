import siteSettings   from "./siteSettings";
import navItem        from "./navItem";
import pageSettings   from "./pageSettings";
import homePage       from "./homePage";
import capability     from "./capability";
import market         from "./market";
import productCategory from "./productCategory";
import productItem    from "./productItem";
import caseStudy      from "./caseStudy";
import certification  from "./certification";
import facility       from "./facility";
import careersPage    from "./careersPage";
import person         from "./person";
import newsPost       from "./newsPost";

export const schemaTypes = [
  // Settings & structure
  siteSettings, navItem, pageSettings,
  // Pages with their own document
  homePage, careersPage,
  // Content types
  capability, market,
  productCategory, productItem,
  caseStudy, certification, facility,
  person, newsPost,
];
