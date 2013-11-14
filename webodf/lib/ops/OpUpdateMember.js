/**
 * @license
 * Copyright (C) 2013 KO GmbH <copyright@kogmbh.com>
 *
 * @licstart
 * This file is part of WebODF.
 *
 * WebODF is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License (GNU AGPL)
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * WebODF is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with WebODF.  If not, see <http://www.gnu.org/licenses/>.
 * @licend
 *
 * @source: http://www.webodf.org/
 * @source: https://github.com/kogmbh/WebODF/
 */

/*global ops, runtime*/

runtime.loadClass("ops.Member");

/**
 * OpUpdateMember allows you to set and remove
 * certain properties.
 * 'fullName', 'color', and 'imageUrl' are not
 * removable, they will be filtered out of 
 * removedProperties if found.
 * @constructor
 * @implements ops.Operation
 */
ops.OpUpdateMember = function OpUpdateMember() {
    "use strict";

    var memberid, timestamp,
        /**@type{Object}*/setProperties,
        /**@type{{attributes}}*/removedProperties;

    this.init = function (data) {
        memberid = data.memberid;
        timestamp = parseInt(data.timestamp, 10);
        setProperties = data.setProperties;
        removedProperties = data.removedProperties;
    };

    this.execute = function (odtDocument) {
        var member = odtDocument.getMember(memberid);

        if (!member) {
            return false;
        }

        if (removedProperties) {
            member.removeProperties(removedProperties);
        }
        if (setProperties) {
            member.setProperties(setProperties);
        }

        odtDocument.emit(ops.OdtDocument.signalMemberUpdated, member);
        return true;
    };

    this.spec = function () {
        return {
            optype: "UpdateMember",
            memberid: memberid,
            timestamp: timestamp,
            setProperties: setProperties,
            removedProperties: removedProperties
        };
    };
};
