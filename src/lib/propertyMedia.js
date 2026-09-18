const asUrl = item => typeof item === 'string' ? item : item?.url || item?.href || item?.mediaUrl || item?.media_url || item?.photoUrl || item?.photo_url;

export function extractPropertyMedia(source = {}) {
  const listing = source.listing || {};
  const groups = [source.photos, source.images, source.media?.photos, source.media?.images, listing.photos, listing.images, listing.media?.photos, listing.media?.images];
  const singles = [source.photoUrl, source.photo_url, source.primaryPhotoUrl, source.primary_photo_url, listing.photoUrl, listing.photo_url, listing.primaryPhotoUrl, listing.primary_photo_url];
  const photos = [...new Set([...singles, ...groups.flatMap(group => Array.isArray(group) ? group : [])].map(asUrl).filter(url => /^https?:\/\//i.test(url || '')))];
  const listingUrl = listing.listingUrl || listing.url || listing.detailUrl || source.listingUrl || source.listing_url || source.detailUrl || source.sourceUrl || '';
  return { photoUrl: photos[0] || '', photos: photos.map(url => ({ url })), listingUrl };
}