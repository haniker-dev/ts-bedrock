type Maybe<T> = T | null

// Decode this data type
export type CrazyData = {
  title: string
  createdAt: number
  isAdmin: boolean
  strArray: string[]
  createdBy: User
  subscribers: User[]
  profile: Maybe<string>
  // remoteData: RemoteData<number, string>
  env: {
    NODE_ENV: string
    debug: boolean
    port: number
  }
}

type User = {
  name: string
  email: string
}
