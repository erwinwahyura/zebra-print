Vue.component('printer-info', {
  template: `
    <div class="printer-main">

      <div id="printer_select" class="printer-selected">
        <div class="printer-name-option">
          Zebra Printer Options
        </div>
        <div class="printer-current">
          Printer: <select id="printers"></select>
        </div>
      </div> <!-- /printer_select -->
      <div id="print_form" class="btn-print">
        <button type="button" class="btn-primary" @click="checkConnection" value="Print">Print Barcode!</button>
        <button type="button" class="btn-primary" @click="logout" value="Print">LogOut!</button>
      </div> <!-- /print_form -->
      <div id="error_div" class="error-page"><div id="error_message"></div>
        <button type="button" class="btn btn-success" onclick="trySetupAgain()">Try Again</button>
      </div><!-- /error_div -->
    </div>
  `,
  data () {
    return {}
  },
  methods: {
    checkConnection () {
      this.$emit('emit-check-conn')
    },
    logout () {
      this.$emit('emit-logout')
    }
  },
  created () {

  }
})
