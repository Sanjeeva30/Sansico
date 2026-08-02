import siteSettings    from "./siteSettings";
import navItem         from "./navItem";
import pageSettings    from "./pageSettings";
import { navChild, navTopItem, footerLink, footerColumn, navigation } from "./navigation";
import homePage        from "./homePage";
import companyPage     from "./companyPage";
import careersPage     from "./careersPage";
import capability      from "./capability";
import market          from "./market";
import productCategory from "./productCategory";
import productItem     from "./productItem";
import caseStudy       from "./caseStudy";
import certification   from "./certification";
import facility        from "./facility";
import person          from "./person";
import whyIndonesia from "./whyIndonesia";
import newsPost        from "./newsPost";
import styledString    from "./styledString";
import styledText      from "./styledText";

import { primitives }  from "./v2/primitives";
import { blocks }      from "./v2/blocks";
import { v2Documents } from "./v2/documents";

export const schemaTypes = [
  // v2 — the section-block model
  ...v2Documents,
  ...blocks,
  ...primitives,

  // shared / carried over from v1
  siteSettings, navItem, pageSettings,
  navigation, navTopItem, navChild, footerColumn, footerLink,
  homePage, companyPage, careersPage,
  capability, market,
  productCategory, productItem,
  caseStudy, certification, facility,
  person, newsPost, whyIndonesia,
  styledString, styledText,
];
