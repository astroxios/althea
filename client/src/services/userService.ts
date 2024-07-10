import { registerSchema } from "src/types/loginRegister";

export async function getUser() {
  const response = await fetch('/api/user');
  return response.json();
}

export async function createUser(request: Request) {
    const body: unknown = await request.json()

    const result = registerSchema.safeParse(body)
    let zodErrors = {}
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }
      })
    }

    return Object.keys(zodErrors).length > 0
      ? { errors: zodErrors } 
      : { success: true }
}

export async function updateUser() {

}
