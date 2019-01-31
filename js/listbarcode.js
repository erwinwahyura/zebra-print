Vue.component('list-barcode', {
  template: `
    <div class="table-parent">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Barcode</th>
            <th scope="col">Creator</th>
            <th scope="col">Quantity</th>
            <th scope="col">Section</th>
            <th scope="col">Length</th>
            <th scope="col">Finish</th>
            <th scope="col">Is Full</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(l, i) in data" :key="i" scope="row">
            <th class="list-text"> {{ i+1 }} </th>
            <th class="list-text"> {{ l.barcode }} </th>
            <th class="list-text"> {{ l.user }} </th>
            <th class="list-text"> {{ l.quantity }} </th>
            <th class="list-text"> {{ l.section }} </th>
            <th class="list-text"> {{ l.length }} </th>
            <th class="list-text"> {{ l.finish }} </th>
            <th class="list-text"> {{ l.is_full }} </th>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  props: ['data'],
  data () {
    return {
    }
  },
  methods: {
    
  }
})
