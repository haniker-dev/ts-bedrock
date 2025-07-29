import { create } from "../../../../Core/Data/Queue/AggregateQueue"

describe("Data/Queue/AggregateQueue", () => {
  it("Creates an AggregateQueue", async () => {
    let counter = 0
    const runThisFnOnce = () => {
      counter++ // Note the final result is all 1
      return new Promise((resolve) => resolve(counter))
    }
    const runQueue1 = create(runThisFnOnce)
    const runQueue2 = create(runThisFnOnce)
    const allResults = await Promise.all([
      runQueue1(),
      runQueue1(),
      runQueue1(),
      runQueue2(),
      runQueue2(),
      runQueue2(),
    ])
    // The state of queue1 and queue2 are separated
    assert.deepStrictEqual(allResults, [1, 1, 1, 2, 2, 2])
  })
})
