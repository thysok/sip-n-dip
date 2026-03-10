/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as categories from "../categories.js";
import type * as contactMessages from "../contactMessages.js";
import type * as featuredDonuts from "../featuredDonuts.js";
import type * as files from "../files.js";
import type * as galleryPhotos from "../galleryPhotos.js";
import type * as menuItems from "../menuItems.js";
import type * as reviews from "../reviews.js";
import type * as reviewsSync from "../reviewsSync.js";
import type * as seed from "../seed.js";
import type * as seedMenu from "../seedMenu.js";
import type * as seedTripAdvisorReviews from "../seedTripAdvisorReviews.js";
import type * as seedYelpReviews from "../seedYelpReviews.js";
import type * as shopSettings from "../shopSettings.js";
import type * as teamMembers from "../teamMembers.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  categories: typeof categories;
  contactMessages: typeof contactMessages;
  featuredDonuts: typeof featuredDonuts;
  files: typeof files;
  galleryPhotos: typeof galleryPhotos;
  menuItems: typeof menuItems;
  reviews: typeof reviews;
  reviewsSync: typeof reviewsSync;
  seed: typeof seed;
  seedMenu: typeof seedMenu;
  seedTripAdvisorReviews: typeof seedTripAdvisorReviews;
  seedYelpReviews: typeof seedYelpReviews;
  shopSettings: typeof shopSettings;
  teamMembers: typeof teamMembers;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
