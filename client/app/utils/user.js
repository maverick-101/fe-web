export function getRole(user) {
  if (user.agency_rights_id == 0) {
    return 'agencyAdmin'
  } else
  return user ? (user.agency ? 'agent' : 'user') : null;
}
