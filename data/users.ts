export type User = {
  id: string
  email: string
  password: string
  name: string
  role: "admin" | "staff"
}

export const users: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    password: "$2a$10$/3VHMJvkXycetvBEBX6FruMdUF3fXk.u8DTZ5X7ICxWGue94OBTB6", 
  },
  {
    id: "2",
    email: "staff@example.com",
    name: "Staff Member",
    role: "staff",
    password: "$2a$10$JIdVwcrupllzZ87a7o6m1.xng4LUkOhiajUj2Gp13XbNFE5rKN/52", 
  },
]