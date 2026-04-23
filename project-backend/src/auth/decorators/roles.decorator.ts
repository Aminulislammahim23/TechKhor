export const Roles = (...roles: string[]) => (target, key, descriptor) => {
  descriptor.value.roles = roles;
};