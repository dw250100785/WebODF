/**
 * @license
 *
 * Copyright (C) 2012 KO GmbH <copyright@kogmbh.com>
 *
 * @licstart
 * The JavaScript code in this page is free software: you can redistribute it
 * and/or modify it under the terms of the GNU Affero General Public License
 * (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.  The code is distributed
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.
 *
 * As additional permission under GNU AGPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * As a special exception to the AGPL, any HTML file which merely makes function
 * calls to this code, and for that purpose includes it by reference shall be
 * deemed a separate work for copyright law purposes. In addition, the copyright
 * holders of this code give you permission to combine this code with free
 * software libraries that are released under the GNU LGPL. You may copy and
 * distribute such a system following the terms of the GNU AGPL for this code
 * and the LGPL for the libraries. If you modify this code, you may extend this
 * exception to your version of the code, but you are not obligated to do so.
 * If you do not wish to do so, delete this exception statement from your
 * version.
 *
 * This license applies to this entire compilation.
 * @licend
 * @source: http://www.webodf.org/
 * @source: http://gitorious.org/webodf/webodf/
 */
/*global require,process */

/*
 * usage: node .../webodf/tools/dojoNlsCompile.js $start l1 l2 l3 [...]
 *
 * $start must be the last argument containing a '/' character
 *   and shall point to the start of directory traversal.
 *
 * lx (l1, l2, l3) are locale-abbreviations for the languages of interest.
 */
(function() {
	"use strict";
	var fs = require("fs"),
	log=function(x) {
		process.stderr.write(x);
		process.stderr.write("\n");
	},
	output_file,
	stat,
	start=process.argv[1],
	langs = process.argv;
	langs.shift(); // node interpreter
	// skip all arguments containing a /
	while (langs[0] && langs[0].match(/\//)) {
		start = langs.shift();
	}

	if (langs.length === 0) {
		log("usage: give languages as arguments!");
		return 0;
	}

	stat = fs.statSync(start);
	if (!(stat && stat.isDirectory())) {
		log("start of traversal is no directory: "+start);
		return 1;
	}
	log("start of traversal: "+start);
	log("filtering langs: "+langs.join(","));

	function lang_filter(nlsdir) {
		var langmatch = langs.join("|");
		if (nlsdir.match(/(uncompressed|consoleStripped)\.js$/)) {
			return false;
		}
		if (nlsdir.match(new RegExp("/nls/("+langmatch+")(/|$)"))) {
			return true;
		}
		if (nlsdir.match(new RegExp("/nls/dojo_("+langmatch+").js$"))) {
			return true;
		}
		if (nlsdir.match(/\/nls\//)) {
			return false;
		}
		return true;
	}

	function traverse(dir, entry_action, nlsflag) {
		fs.readdir(dir, function (err, list) {
			if (err) {
				log("error causing early return from ["+dir+"].");
				return;
			}
			list.forEach(function (entry) {
				var path = dir+"/"+entry;
				fs.stat(path, function(err, stat) {
					if (err) {
						log("stat error ["+path+"].");
						return;
					}
					if (stat && stat.isDirectory()) {
						if (lang_filter(path)) {
							traverse(path, entry_action, nlsflag||(entry==='nls'));
						}
					} else {
						if (nlsflag && lang_filter(path)) {
							if (path.match(/\.js$/)) {
								entry_action(path);
							}
						}
					}

				});
			});
		});
	}

	traverse(start, function(x) {
		fs.readFile(x, function(err, data) {
			if (err) {
				log("failed to read ["+x+"].");
				return;
			}
			process.stdout.write(data);
		});
		log(x);
	});

}());

