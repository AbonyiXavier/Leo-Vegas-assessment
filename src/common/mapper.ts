import { UserResultDto } from '../domains/users/dto/output/user.result.output';

export const mapResult = (
  user: UserResultDto,
  accessToken?: string,
): UserResultDto => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    access_token: accessToken || undefined,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};
