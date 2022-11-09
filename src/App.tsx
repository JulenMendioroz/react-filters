import { ChangeEvent, useEffect, useMemo, useState } from "react"
import "./App.css"

interface IUser {
  id: number
  name: string
  email: string
  city: string
}
const getUsers = async (): Promise<IUser[]> => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users")
  const users = await res.json()
  return users.map((user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    city: user.address.city,
  }))
}
const Card = ({ user }: { user: IUser }) => (
  <li className="card">
    <b>{user.name}</b>: <em>{user.email}</em>
  </li>
)

interface IFilterConfig {
  name: string
  key: string | ((v: any) => string | number),
}

const filterConfig: IFilterConfig[] = [
  {
    name: "First Letter",
    key: (item: any) => item.name[0],
  },
  {
    name: "Email",
    key: "email",
  },
  {
    name: "Longitud",
    key: (item: any) => (item.name.length < 15 ? "short" : "long"),
  },
]

function App() {
  const [users, setUsers] = useState<IUser[]>([])
  const [query, setQuery] = useState<string>("")

  const groups = filterConfig.map(({ name, key }) => {
    const callback: (v: any) => string =
      typeof key === "string" ? (item: any) => item[key] : key

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { checked, value, name } = e.target
      console.log(value)
    }

    const unique = Array.from(new Set(users.map(callback)))
    const values = unique.map((value) => ({
      value,
      isChecked: false,
    }))

    return {
      name,
      values,
      onChange,
    }
  })

  const filtered = !query
    ? users
    : users.filter(({ name }) =>
        name.toLowerCase().includes(query.toLowerCase())
      )

  useEffect(() => {
    getUsers()
      .then((data) => {
        setUsers(data)
        console.log({ data, users })
      })
      .catch(console.error)
  }, [])

  return (
    <section>
      <label htmlFor="search">Search: </label>
      <input
        type="search"
        id="search"
        autoComplete="off"
        value={query}
        // onChange={(e) => setQuery(e.target.value)}
      />
      {groups.map(({ name, values, onChange }) => (
        <fieldset key={name}>
          <legend>{name}</legend>
          {values.map(({ value, isChecked }) => (
            <div key={name + value}>
              <input
                type="checkbox"
                name={name}
                id={value}
                value={value}
                onChange={onChange}
              />
              <label htmlFor={value}>{value}</label>
              <br />
            </div>
          ))}
        </fieldset>
      ))}
      {filtered.length > 0 && (
        <ul>
          {filtered.map((user) => (
            <Card key={user.id} user={user} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default App
