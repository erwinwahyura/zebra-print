var available_printers = null;
var selected_category = null;
var default_printer = null;
var selected_printer = null;
// ^XA
// ^FO100,100^BY7
// ^A0N,40,30^BCN,100,Y,N,N
// ^FD123456^FS
// ^XZ
// var format_start = "^XA^LL200^FO80,50^A0N36,36^FD";
// var format_start = "^XA^B100,100^BY2^BCN,100,Y,N,N^FD123456";

// ^FO150,30^CFD^FDALUTECH^FS

// ini yang udah oke
// var format_start = `
// 	^XA

// 	^FO160,30^CFD^FDALUTECH^FS
// 	^FO20,150^CFD^FDSECTION : 0830^FS
// 	^FO20,180^CFD^FDLENGTH  : 6^FS
// 	^FO20,210^CFD^FDFINISH  : BLACK^FS
// 	^FO20,240^CFD^FDQTY     : 10^FS
// 	^FO250,240^CFD^FDTEMP : 10^FS

// 	^FO500,50^BY2^BCN,50,Y,,N
// 	^FD123456saya^FS

// 	^FO600,30^CFD^FDALUTECH^FS
// 	^FO450,150^CFD^FDSECTION : 0831^FS
// 	^FO450,180^CFD^FDLENGTH  : 10^FS
// 	^FO450,210^CFD^FDFINISH  : BLACK^FS
// 	^FO450,240^CFD^FDQTY     : 10^FS
// 	^FO680,240^CFD^FDTEMP : 10^FS

// 	^FO50,50^BY2^BCN,50,Y,,N
// 	^FD123456saya^FS
// 	`;

// var complete_format = format_horizontal + format_vertical + format_rotation + format_barcode_selection + narrow_barcode + width_barcode + height_barcode + human_readable
// lebar itu BY[1-10]
// tata letak position itu ada di F050,50 -> f050 menunjukkan jarak antara kanan dan kiri (vertical) , lalu 50 itu horizontal

var format_end = "^FS^XZ";
var default_mode = true;

function setup_web_print()
{
	$('#printer_select').on('change', onPrinterSelected);
	showLoading("Loading Printer Information...");
	default_mode = true;
	selected_printer = null;
	available_printers = null;
	selected_category = null;
	default_printer = null;

	BrowserPrint.getDefaultDevice('printer', function(printer)
	{
		default_printer = printer
		if((printer != null) && (printer.connection != undefined))
		{
			selected_printer = printer;
			var printer_details = $('#printer_details');
			var selected_printer_div = $('#selected_printer');

			selected_printer_div.text("Using Default Printer: " + printer.name);
			hideLoading();
			printer_details.show();
			$('#print_form').show();

		}
		BrowserPrint.getLocalDevices(function(printers)
			{
				available_printers = printers;
				var sel = document.getElementById("printers");
				var printers_available = false;
				sel.innerHTML = "";
				if (printers != undefined)
				{
					for(var i = 0; i < printers.length; i++)
					{
						if (printers[i].connection == 'usb')
						{
							var opt = document.createElement("option");
							opt.innerHTML = printers[i].connection + ": " + printers[i].uid;
							opt.value = printers[i].uid;
							sel.appendChild(opt);
							printers_available = true;
						}
					}
				}

				if(!printers_available)
				{
					showErrorMessage("No Zebra Printers could be found!");
					hideLoading();
					$('#print_form').hide();
					return;
				}
				else if(selected_printer == null)
				{
					default_mode = false;
					changePrinter();
					$('#print_form').show();
					hideLoading();
				}
			}, undefined, 'printer');
	},
	function(error_response)
	{
		showBrowserPrintNotFound();
	});
};
function showBrowserPrintNotFound()
{
	showErrorMessage("An error occured while attempting to connect to your Zebra Printer. You may not have Zebra Browser Print installed, or it may not be running. Install Zebra Browser Print, or start the Zebra Browser Print Service, and try again.");

};
function sendData(arr)
{
	showLoading("Printing...");
	checkPrinterStatus( function (text){
		console.log( 'arr' ,arr, '<--------')
		if (text == "Ready to Print")
		{
			// let arr = [{
			// 	name: 'ALUTECH',
			// 	section: '0830',
			// 	length: '10',
			// 	finish: 'BLACK',
			// 	qty: '10',
			// 	temp: '10',
			// 	barcode: '000hr4'
			// }, {
			// 	name: 'ALUTECH',
			// 	section: '0831',
			// 	length: '10',
			// 	finish: 'SILVER',
			// 	qty: '10',
			// 	temp: '10',
			// 	barcode: '000hr3'
			// }]
			for (let i = 0; i<arr.length; i++) {
				var format_start = `
				^XA

				^FO160,30^CFD^FD${arr[i].name}^FS
				^FO20,150^CFD^FDSECTION : ${arr[i].section}^FS
				^FO20,180^CFD^FDLENGTH  : ${arr[i].length}^FS
				^FO20,210^CFD^FDFINISH  : ${arr[i].finish}^FS
				^FO20,240^CFD^FDQTY     : ${arr[i].qty}^FS
				^FO250,240^CFD^FDTEMP : ${arr[i].temp}^FS

				^FO500,50^BY2^BCN,50,Y,,N
				^FD${arr[i].barcode}^FS

				^FO600,30^CFD^FDALUTECH^FS
				^FO450,150^CFD^FDSECTION : 0831^FS
				^FO450,180^CFD^FDLENGTH  : 10^FS
				^FO450,210^CFD^FDFINISH  : BLACK^FS
				^FO450,240^CFD^FDQTY     : 10^FS
				^FO680,240^CFD^FDTEMP : 10^FS

				^FO50,50^BY2^BCN,50,Y,,N
				^FD123456saya^FS
				`;
				// selected_printer.send(format_start + format_end, printComplete, printerError);
			}

		}
		else
		{
			printerError(text);
		}
	});
};
function checkPrinterStatus(finishedFunction)
{
	selected_printer.sendThenRead("~HQES",
				function(text){
						var that = this;
						var statuses = new Array();
						var ok = false;
						var is_error = text.charAt(70);
						var media = text.charAt(88);
						var head = text.charAt(87);
						var pause = text.charAt(84);
						// check each flag that prevents printing
						if (is_error == '0')
						{
							ok = true;
							statuses.push("Ready to Print");
						}
						if (media == '1')
							statuses.push("Paper out");
						if (media == '2')
							statuses.push("Ribbon Out");
						if (media == '4')
							statuses.push("Media Door Open");
						if (media == '8')
							statuses.push("Cutter Fault");
						if (head == '1')
							statuses.push("Printhead Overheating");
						if (head == '2')
							statuses.push("Motor Overheating");
						if (head == '4')
							statuses.push("Printhead Fault");
						if (head == '8')
							statuses.push("Incorrect Printhead");
						if (pause == '1')
							statuses.push("Printer Paused");
						if ((!ok) && (statuses.Count == 0))
							statuses.push("Error: Unknown Error");
						finishedFunction(statuses.join());
			}, printerError);
};
function hidePrintForm()
{
	$('#print_form').hide();
};
function showPrintForm()
{
	$('#print_form').show();
};
function showLoading(text)
{
	$('#loading_message').text(text);
	$('#printer_data_loading').show();
	hidePrintForm();
	$('#printer_details').hide();
	$('#printer_select').hide();
};
function printComplete()
{
	hideLoading();
	alert ("Printing complete");
}
function hideLoading()
{
	$('#printer_data_loading').hide();
	if(default_mode == true)
	{
		showPrintForm();
		$('#printer_details').show();
	}
	else
	{
		$('#printer_select').show();
		showPrintForm();
	}
};
function changePrinter()
{
	default_mode = false;
	selected_printer = null;
	$('#printer_details').hide();
	if(available_printers == null)
	{
		showLoading("Finding Printers...");
		$('#print_form').hide();
		setTimeout(changePrinter, 200);
		return;
	}
	$('#printer_select').show();
	onPrinterSelected();

}
function onPrinterSelected()
{
	selected_printer = available_printers[$('#printers')[0].selectedIndex];
}
function showErrorMessage(text)
{
	$('#main').hide();
	$('#error_div').show();
	$('#error_message').html(text);
}
function printerError(text)
{
	showErrorMessage("An error occurred while printing. Please try again." + text);
}
function trySetupAgain()
{
	$('#main').show();
	$('#error_div').hide();
	setup_web_print();
	hideLoading();
}
