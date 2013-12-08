// JavaScript Document

//typewriter for jQuery !~~~~ for 我的二团我的连

(function(a) {
    a.fn.typewriter = function(callback) {			//modified by zhs;小森森 
        this.each(function() {
            var d = a(this),
            c = d.html(),
            b = 0;
            d.html("");
            var e = setInterval(function() {
                var f = c.substr(b, 1);
                if (f == "<") {
                    b = c.indexOf(">", b) + 1
                } else if(f=="&") {
					b = c.indexOf(";",b)+1;
				} else {
                    b++
                }
                d.html(c.substring(0, b) + (b & 1 ? "_": ""));
                if (b >= c.length) {
					callback();
                    clearInterval(e)
                }
            },
            10)
        });
        return this
    }
})(jQuery);