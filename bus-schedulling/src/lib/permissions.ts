import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt-web";

export interface UserPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
}

interface User {
  role: string;
  [key: string]: unknown;
}

export function getRolePermissions(role: string): UserPermissions {
  switch (role) {
    case 'admin':
      return {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canView: true,
      };
    case 'dispatcher':
      return {
        canCreate: true,
        canEdit: true,
        canDelete: false, // Cannot delete users or buses
        canView: true,
      };
    case 'viewer':
      return {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true,
      };
    default:
      return {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canView: true,
      };
  }
}

export async function checkPermission(
  request: NextRequest,
  requiredPermission: keyof UserPermissions
): Promise<{ authorized: boolean; user?: User; error?: string }> {
  try {
    const token = request.cookies.get("token");
    
    if (!token) {
      return { authorized: false, error: "No token provided" };
    }

    const user = await verifyJWT(token.value, process.env.JWT_SECRET || "secretkey") as User;
    const permissions = getRolePermissions(user.role);

    if (!permissions[requiredPermission]) {
      return { 
        authorized: false, 
        error: `Insufficient permissions. Required: ${requiredPermission}` 
      };
    }

    return { authorized: true, user };
  } catch (error) {
    return { authorized: false, error: "Invalid token" };
  }
}

export function createUnauthorizedResponse(error: string) {
  return NextResponse.json(
    { error },
    { status: 403 }
  );
}