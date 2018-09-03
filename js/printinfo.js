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
        <button type="button" class="btn-primary" @click="sendData" value="Print">Print Barcode!</button>
      </div> <!-- /print_form -->
      <div id="error_div" class="error-page"><div id="error_message"></div>
        <button type="button" class="btn btn-success" onclick="trySetupAgain()">Try Again</button>
      </div><!-- /error_div -->
    </div>
  `,
  data () {
    return {
      arr: [{
      	name: 'ALUTECH',
      	section: '0830',
      	length: '10',
      	finish: 'BLACK',
      	qty: '10',
      	temp: '10',
      	barcode: '0000754-2IR'
      }]
    }
  },
  methods: {
    sendData () {
      let self = this
      this.showLoading("Printing...")
    	this.checkPrinterStatus(function (text) {
    		if (text == "Ready to Print") {
    			for (let i = 0; i<self.arr.length; i++) {
    				var format_start = `
    				^XA

    				^FO160,30^CFD^FD${self.arr[i].name}^FS
    				^FO20,150^CFD^FDSECTION : ${self.arr[i].section}^FS
    				^FO20,180^CFD^FDLENGTH  : ${self.arr[i].length}^FS
    				^FO20,210^CFD^FDFINISH  : ${self.arr[i].finish}^FS
    				^FO20,240^CFD^FDQTY     : ${self.arr[i].qty}^FS
    				^FO250,240^CFD^FDTEMP : ${self.arr[i].temp}^FS

    				^FO500,50^BY2^BCN,50,Y,,N
    				^FD${self.arr[i].barcode}^FS

    				^FO600,30^CFD^FDALUTECH^FS
    				^FO450,150^CFD^FDSECTION : 0831^FS
    				^FO450,180^CFD^FDLENGTH  : 10^FS
    				^FO450,210^CFD^FDFINISH  : BLACK^FS
    				^FO450,240^CFD^FDQTY     : 10^FS
    				^FO680,240^CFD^FDTEMP : 10^FS

    				^FO50,50^BY2^BCN,50,Y,,N
    				^FD123456saya^FS
    				`
            var format_end = "^FS^XZ"
    				selected_printer.send(format_start + format_end, this.printComplete())
    			}
    		} else {
    			this.printerError(text)
    		}
    	})
    },
    checkPrinterStatus (finishedFunction) {
      selected_printer.sendThenRead("~HQES", function (text) {
        var that = this
        var statuses = new Array()
        var ok = false
        var is_error = text.charAt(70)
        var media = text.charAt(88)
        var head = text.charAt(87)
        var pause = text.charAt(84)
        // check each flag that prevents printing
        if (is_error == '0') {
          ok = true
          statuses.push("Ready to Print")
        }
        if (media == '1')
          statuses.push("Paper out")
        if (media == '2')
          statuses.push("Ribbon Out")
        if (media == '4')
          statuses.push("Media Door Open")
        if (media == '8')
          statuses.push("Cutter Fault")
        if (head == '1')
          statuses.push("Printhead Overheating")
        if (head == '2')
          statuses.push("Motor Overheating")
        if (head == '4')
          statuses.push("Printhead Fault")
        if (head == '8')
          statuses.push("Incorrect Printhead")
        if (pause == '1')
          statuses.push("Printer Paused")
        if ((!ok) && (statuses.Count == 0))
          statuses.push("Error: Unknown Error")
          finishedFunction(statuses.join())
      }, this.printerError)
    },
    printerError (text) {
      this.showErrorMessage("An error occurred while printing. Please try again." + text)
    },
    showErrorMessage (text) {
    	$('#main').hide()
    	$('#error_div').show()
    	$('#error_message').html(text)
    },
    printComplete() {
    	this.hideLoading()
    	alert ("Printing complete")
    },
    hideLoading () {
    	$('#printer_data_loading').hide()
    	if(default_mode == true) {
    		showPrintForm()
    		$('#printer_details').show()
    	} else {
    		$('#printer_select').show()
    		showPrintForm()
    	}
    },
    showLoading (text) {
    	$('#loading_message').text(text)
    	$('#printer_data_loading').show()
    	this.hidePrintForm()
    	$('#printer_details').hide()
    	$('#printer_select').hide()
    },
    hidePrintForm () {
    	$('#print_form').hide()
    }
  },
  created () {

  }
})
