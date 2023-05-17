function* GetUniqId(): Generator<number, number, number> {
  var index = 1
  while (true) yield index++
}

export default function uniqIdFactory() {
  const gen = GetUniqId()
  return function getUniqId() {
    return gen.next().value
  }
}
