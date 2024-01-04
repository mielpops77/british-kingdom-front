export interface BannerSection {
  bannerImages: string[];
  maleDescription: string;
  kittenDescription: string;
  femaleDescription: string;
  title: string;
  subtitle: string;
  maleImg: string;
  kittenImg: string;
  femaleImg: string;
  titleFontSize: number;
  titleFontStyle: string;
  titleFontFamily: string;
  subtitleFontSize: number;
  subtitleFontStyle: string;
  subtitleFontFamily: string;
  colorHeader: string,
  titleColor: string,
  subtitleColor: string,
  titleCard1: string,
  titleCard2: string,
  titleCard3: string,
  menu: string[],
  colorMenu: string,
  hoverColorMenu: string,
  fontStyleMenu : string,
  colorFooter : string,
  favicon: string,


  // page males
  titlePageMales: string,
  titleFontStylePageMales: string,
  titleColorPageMales: string,
  textPageMales: string,
  textFontStylePageMales: string,
  textColorPageMales: string,
  bordureColorPageMales: string,



  //page femelles

  TitlePageFemelles: string,
  TitleFontStylePageFemelles: string,
  TitleColorPageFemelles: string,
  TextPageFemelles: string,
  TextFontStylePageFemelles: string,
  TextColorPageFemelles: string,
  BordureColorPageFemelles: string,

    //page conditions
    titlePageConditions: string,
    titleFontStylePageConditions: string,
    titleColorPageConditions: string,
    sousTitlePageConditions: any[];
    sousTitleFontStylePageConditions: string,
    sousTitleColorPageConditions: string,
    textPageConditions: any[];
    textFontStylePageConditions: string,
    textColorPageConditions: string,
    bordureColorPageConditions: string

}

