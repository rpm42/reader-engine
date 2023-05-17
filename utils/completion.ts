import { BehaviorSubject } from 'rxjs'
import uniqIdFactory from './uniq-id'

const getUniqId = uniqIdFactory()

export default class Completion extends BehaviorSubject<number> {
  constructor() {
    super(getUniqId())
  }
}
