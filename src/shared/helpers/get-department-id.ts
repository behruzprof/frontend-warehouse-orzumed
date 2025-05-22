export enum Roles {
        ADMIN = 'skajdLJO*WEIdjSND12owilkJO@IWKD93dj@(EIDLKSNADSA(@JIWLK!(IWOJDLKA',
        USER = 'отделения',
}

export const getDepartmentIdFromLocalStorage = (): string => {
  checkPasswordAndSetRole()
  let id = localStorage.getItem('departmentId')

  while (!id) {
    id = window.prompt("Bo'lim ID sini kiriting:")?.trim() || ''
    if (id) {
      localStorage.setItem('departmentId', id)
    }
  }

  return id
}

export const getRoleFromLocalStorage = (): string => {
  checkPasswordAndSetRole()
  let role = localStorage.getItem('role')
  while (!role) {
    role = window.prompt('Rolni kiriting:')?.trim() || ''
    if (role) {
      localStorage.setItem('role', role)
    }
  }
  return role
}

export const checkPasswordAndSetRole = () => {
  const storedPassword = localStorage.getItem('authPassword')
  const storedRole = localStorage.getItem('role')

  const pass1 = 'staticpassword88991100'
  const pass2 = 'otdeleniya12344321'

  if (
    (storedPassword === pass1 && storedRole === Roles.ADMIN) ||
    (storedPassword === pass2 && storedRole === Roles.USER)
  ) {
    return true
  }

  while (true) {
    const input = window.prompt('Parolni kiriting:')?.trim()
    if (!input) continue

    if (input === pass1) {
      localStorage.setItem('authPassword', input)
      localStorage.setItem('role', Roles.ADMIN)
      break
    }

    if (input === pass2) {
      localStorage.setItem('authPassword', input)
      localStorage.setItem('role', Roles.USER)
      break
    }

    alert("Noto'g'ri parol. Qayta urinib ko'ring.")
  }
}
