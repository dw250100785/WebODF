/**
 * Copyright (C) 2012 KO GmbH <jos.van.den.oever@kogmbh.com>
 * @licstart
 * The JavaScript code in this page is free software: you can redistribute it
 * and/or modify it under the terms of the GNU Affero General Public License
 * (GNU AGPL) as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.  The code is distributed
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU AGPL for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this code.  If not, see <http://www.gnu.org/licenses/>.
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
 * @source: https://github.com/kogmbh/WebODF/
 */
/*global runtime, core*/
runtime.loadClass("core.JSLint");

function checkWithJSLINT(file) {
    "use strict";
    var i, jslint = new core.JSLint().JSLINT,
        jslintconfig = {
            ass:        false, // if assignment expressions should be allowed
            bitwise:    false, // if bitwise operators should be allowed
            browser:    false, // if the standard browser globals should be predefined
            closure:    true,  // if Google Closure idioms should be tolerated
            'continue': false, // if the continuation statement should be tolerated
            debug:      false, // if debugger statements should be allowed
            defined:    false, // if already defined variables are allowed
            devel:      false, // if logging should be allowed (console, alert, etc.)
            emptyblock: false, // if empty blocks should be allowed
            eqeq:       false, // if == should be allowed
            evil:       false, // if eval should be allowed
            forin:      false, // if for in statements need not filter
            indent:     4, //the indentation factor
            maxerr:     20, //the maximum number of errors to allow
            //maxlen:   300  the maximum length of a source line
            newcap:     false, // if constructor names capitalization is ignored
            node:       false, // if Node.js globals should be predefined
            nomen:      false, // if names may have dangling _
            passfail:   false, // if the scan should stop on first error
            plusplus:   false, // if increment/decrement should be allowed
            properties: false, // if all property names must be declared with /*properties*/
            regexp:     false, // if the . should be allowed in regexp literals
            rhino:      false, // if the Rhino environment globals should be predefined
            unparam:    false, // if unused parameters should be tolerated
            sloppy:     false, // if the 'use strict'; pragma is optional
            stupid:     true,  // if really stupid practices are tolerated
            sub:        false, // if all forms of subscript notation are tolerated
            todo:       true,  // if TODO comments are tolerated
            unvar:      false, // if unused variables should be tolerated
            vars:       false, // if multiple var statements per function should be allowed
            white:      true   // if sloppy whitespace is tolerated
        },
        data, result, err;

    // these files are an exception for now
    if (file === "lib/core/RawInflate.js") {
        return;
    }

    data = runtime.readFileSync(file, "utf-8");
    result = jslint(data, jslintconfig);
    if (!result) {
        for (i = 0; i < jslint.errors.length && jslint.errors[i]; i += 1) {
            err = jslint.errors[i];
            runtime.log(file + ":" + err.line + ":" + err.character +
                ": error: " + err.reason);
        }
        runtime.exit(1);
    }
}

var i;
for (i = 0; i < arguments.length; i += 1) {
    checkWithJSLINT(arguments[i]);
}
