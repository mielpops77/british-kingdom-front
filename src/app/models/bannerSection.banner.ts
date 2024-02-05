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
  titleFontStyleCard?: string;
  titleColorCard?: string;
  textFontStyleCard?: string;
  textColorCard?: string;
  backgroundColorCard?: string;



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
  fontStyleMenu: string,
  colorFooter: string,
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

  textPageCondition: string,

  //page chatons

  titleFontStylePageChatons?: string;
  titleColorPageChatons?: string;

  info1FontStylePageChatons?: string;
  info1ColorPageChatons?: string;

  info2FontStylePageChatons?: string;
  info2ColorPageChatons?: string;

  info3FontStylePageChatons?: string;
  info3ColorPageChatons?: string;

  bordureColorPageChatons?: string;

  buttonColorPageChatons?: string;
  buttonTextColorPageChatons?: string;
  buttonTextFontStylePageChatons?: string;

  //page Contact

  textPageContact?: string;

  // Page Livre d'Or
  titlePagelivreDor?: string;
  titleFontStylePagelivreDor?: string;
  titleColorPagelivreDor?: string;
  buttonColorPagelivreDor?: string;
  buttonTextColorPagelivreDor?: string;
  buttonTextFontStylePagelivreDor?: string;



  // Page chat profil
  titleFontStylePagechatProfil?: string;
  titleColorPagechatProfil?: string;
  textFontStylePagechatProfil?: string;
  textColorPagechatProfil?: string;
  buttonColorPagechatProfil?: string;
  buttonTextColorPagechatProfil?: string;
  buttonTextFontStylePagechatProfil?: string;
  bordureColorPagechatProfil?: string;
  bagroundColorPagechatProfil?: string;

  // Page chaton profil
  titleFontStylePagechatonProfil?: string;
  titleColorPagechatonProfil?: string;
  textFontStylePagechatonProfil?: string;
  textColorPagechatonProfil?: string;
  statusNameFontStylePagechatonProfil?: string;
  statusNameColorPagechatonProfil?: string;
  breedFontStylePagechatonProfil?: string;
  breedColorPagechatonProfil?: string;
  bagroundColorBreedPagechatonProfil?: string;
}

