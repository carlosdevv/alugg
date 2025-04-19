"use client";

import {
  ApertureIcon,
  ArrowRightIcon,
  AtSignIcon,
  BadgeHelpIcon,
  BellIcon,
  BringToFrontIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  CircleAlertIcon,
  CircleHelpIcon,
  CircleIcon,
  CircleMinusIcon,
  CirclePlusIcon,
  Clock1Icon,
  CogIcon,
  ComponentIcon,
  CopyIcon,
  CrownIcon,
  DownloadIcon,
  EllipsisIcon,
  EllipsisVertical,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  FileDownIcon,
  FileTextIcon,
  FileUpIcon,
  FlagIcon,
  GemIcon,
  GlobeIcon,
  HistoryIcon,
  Home,
  ImageIcon,
  LayersIcon,
  List,
  LoaderIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  MousePointerClickIcon,
  MoveUpRight,
  Package,
  PanelLeftIcon,
  ReceiptTextIcon,
  Rotate3dIcon,
  Settings2,
  Settings2Icon,
  ShieldAlertIcon,
  ShoppingBagIcon,
  ShoppingCart,
  SlashIcon,
  SunIcon,
  Trash2Icon,
  UserCogIcon,
  UserMinusIcon,
  UserPlusIcon,
  UsersIcon,
  WaypointsIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";

import { ComponentType, SVGProps } from "react";

export type IconType = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;

export const Icons = {
  globe: GlobeIcon,
  userCog: UserCogIcon,
  gem: GemIcon,
  waypoints: WaypointsIcon,
  badgeHelp: BadgeHelpIcon,
  component: ComponentIcon,
  menu: MenuIcon,
  users: UsersIcon,
  bringToFront: BringToFrontIcon,
  copy: CopyIcon,
  flag: FlagIcon,
  mousePointer: MousePointerClickIcon,
  arrowRight: ArrowRightIcon,
  list: List,
  package: Package,
  home: Home,
  shoppingCart: ShoppingCart,
  circlePlus: CirclePlusIcon,
  circleMinus: CircleMinusIcon,
  help: CircleHelpIcon,
  slash: SlashIcon,
  loader: LoaderIcon,
  check: CheckIcon,
  arrowDown: ChevronDownIcon,
  calendar: CalendarDaysIcon,
  horizontalEllipsis: EllipsisIcon,
  delete: Trash2Icon,
  settings: Settings2,
  circle: CircleIcon,
  clock: Clock1Icon,
  checkCircle: CheckCircle2Icon,
  chevronsUpDown: ChevronsUpDownIcon,
  logo: ApertureIcon,
  image: ImageIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  verticalEllipsis: EllipsisVertical,
  moveUpRight: MoveUpRight,
  x: XIcon,
  update: Settings2Icon,
  signOut: LogOutIcon,
  eye: EyeIcon,
  eyeOff: EyeOffIcon,
  alert: ShieldAlertIcon,
  cog: CogIcon,
  receipt: ReceiptTextIcon,
  panelLeft: PanelLeftIcon,
  atSign: AtSignIcon,
  bag: ShoppingBagIcon,
  layers: LayersIcon,
  userPlus: UserPlusIcon,
  userMinus: UserMinusIcon,
  crown: CrownIcon,
  transferOwnership: Rotate3dIcon,
  bell: BellIcon,
  sun: SunIcon,
  moon: MoonIcon,
  circleAlert: CircleAlertIcon,
  externalLink: ExternalLinkIcon,
  download: DownloadIcon,
  file: FileTextIcon,
  history: HistoryIcon,
  fileUp: FileUpIcon,
  fileDown: FileDownIcon,
};
