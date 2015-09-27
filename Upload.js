function el(id){return document.getElementById(id);} // Get elem by ID

var canvas  = el("canvas");
var context = canvas.getContext("2d");
var colorCodeFinal = {};

function printColors(colorCodes){
    var colorPaletteCanvas = el("colorPalette");
    var colorPaletteContext = colorPaletteCanvas.getContext("2d");
    var keys = Object.keys(colorCodes);

    var size = 0;
    for(color in colorCodes){
        size += 1;
    }
    console.log(size);
    var currColorIndex = 0;
    var i = 15, j = 15;
    var nof_rows = 0
    if(size % 10 == 0)
        nof_rows = size / 10;
    else
        nof_rows = (size / 10 ) + 1;

    colorPaletteCanvas.height = nof_rows * 110;

    colorPaletteContext.clearRect(0, 0, colorPaletteCanvas.width, colorPaletteCanvas.height);
    var curr_col = 0
    for(color in colorCodes){
        console.log(color + " ," + j + " ," + i);
        colorPaletteContext.fillStyle = color;
        colorPaletteContext.fillRect(j , i, 70, 70);

        colorPaletteContext.font = "20px Georgia";
        colorPaletteContext.fillStyle = "#000000";
        colorPaletteContext.fillText(color, j, i + 90);
        curr_col += 1;
        if(j < colorPaletteCanvas.width && curr_col < 10){
            j += 85;
        }
        else{
            if(i < colorPaletteCanvas.height){
                i += 110;
            }
            
            j = 15;
            curr_col = 0;
        }

    }
}
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function isValidMajor(colorCodes, hex){
    var valid = true;
    for(color in colorCodes){
        var a = parseInt(color.slice(1),16);
        var b = parseInt(hex.slice(1),16)
        var diff = Math.abs(a - b);

        //Difference is 300000

        if(diff < parseInt("493E0", 16))
        {
            valid = false;
            break;
        }
    }
    return(valid);
}
function readImage() {
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
           var img = new Image();
           img.onload = function() {
                context.drawImage(img, 0, 0, canvas.width, canvas.height);

                var colorCodes = {};
                img.crossOrigin = "Anonymous";
                var imgData = context.getImageData(0, 0, canvas.width, canvas.height);

                var i;
                var blockSize = 25;
                var prev = rgbToHex(imgData.data[0], imgData.data[1], imgData.data[2]);
                for (i = 0; i < imgData.data.length; i += (4 * blockSize)) {
                    var r, g ,b, a;
                    r = imgData.data[i] ;
                    g = imgData.data[i+1];
                    b = imgData.data[i+2];
                    a = imgData.data[i+3];
                    var hex = ("000000" + rgbToHex(r, g, b)).slice(-6);
                    var hexString = "#" + hex;
                    
                    prev = hex;
                    var valid = isValidMajor(colorCodes, hexString);
                    var colorFound = (hexString in colorCodes);
                    if( !colorFound && valid == true)
                        colorCodes[hexString] = 1;
                    else if(valid == false && colorFound)
                        colorCodes[hexString] += 1;

                }

                printColors(colorCodes);
                colorCodeFinal = colorCodes;

           };
    img.src = e.target.result;
        };       
        FR.readAsDataURL( this.files[0] );
    }
}

el("fileUpload").addEventListener("change", readImage, false);

function constructBody(){
    var body = "";
    for(color in colorCodeFinal){
        body += color + " \n";
    }
    return(body);
}
function sendEmail(){
    var link = "mailto:"
             + "&subject=" + escape("Color Codes")
             + "&body=" + escape(constructBody());

    window.location.href = link;
}
function init(){
    var img = new Image();
    img.src = "upload.png";
    var init_canvas  = el("canvas");
    var init_context = canvas.getContext("2d");

    init_context.font = "50px Georgia";
    init_context.fillStyle = "#0052CC";
    init_context.fillText("UPLOAD", 0, 120, init_canvas.width, init_canvas.height);  
}
window.onload = init();