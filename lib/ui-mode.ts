/**
 * Phone detection shared by the server mode gate (app/page.tsx) and the
 * client header, so both agree on which experience "/" boots by default.
 * iPads masquerade as Macs in desktop mode on purpose — treated as desktop.
 */
export const MOBILE_UA = /Mobi|Android|iPhone/i;
