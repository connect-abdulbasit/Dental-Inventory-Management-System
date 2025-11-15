export type User = {
  id: string
  email: string
  password: string
  name: string
  role: "clinic_admin" | "clinic_member" | "supplier"
}

export const users: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Clinic Administrator",
    role: "clinic_admin",
    password: "$2a$10$R.800DIHGM52.mj2copKiOSiLthnp2h0HmFm4odxNQUhIDBAvZVMG", // password: admin123
  },
  {
    id: "2",
    email: "member@example.com",
    name: "Clinic Member",
    role: "clinic_member",
    password: "$2a$10$tF3gtjwyb5QNCzsz53jbSuJ8aaxcbWhDnX1tYVBRmOjKQRf5yWKH6", // password: member123
  },
  {
    id: "3",
    email: "supplier@example.com",
    name: "Supplier User",
    role: "supplier",
    password: "$2a$10$0gLD82b/x2hd8tFrdxLWBeOXwQX6oLQxMhJ/Xul9HnwF5tyGZh0Ti", // password: supplier123
  },
]