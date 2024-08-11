import { BubblesSearch } from '$lib'
import '$lib/index.css'


const nameDataset = [{ id: 1, name: 'glebchanskiy' }, { id: 3, name: 'baddmood' }, { id: 4, name: 'qilp' }, { id: 2, name: 'ardonplay' }]
const kekDataset =  [{ name: 'kek1' }, { name: 'kek2' }, { name: 'kek3' }]
BubblesSearch.mount('#app', {
  hints: {
    name: {
      type: 'list',
      item: (props: { id: number, name: string }) => <>{props.name}</>,
      getOptions: val => nameDataset.filter(o => o.name.startsWith(val)),
      format: (val) => val.name,
      deserialize: (val) => nameDataset.filter(n => n.name === val)[0]
    },
    keklist: {
      type: 'list',
      item: (props: { name: string }) => <>{props.name}</>,
      getOptions: partialValue =>
        kekDataset.filter(l => l.name.startsWith(partialValue)),
      format: (val) => val.name,
      deserialize: (val) => kekDataset.filter(n => n.name === val)[0]
    },
  },
  onInput: v => {
    console.log('values: ', v)
  },
})

// 
