/*

 Based on
 Ken Burns effect JQuery plugin
 Copyright (C) 2011 Will McGugan http://www.willmcgugan.com

 Modified by Agung Bayu for JKreativ

 VERSION : 0.1

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function(e,t){e.fn.kenburned=function(t){function T(){i=null;l=t.display_time||7e3;c=Math.min(l/2,t.fade_time||1e3);h=l-c*2;p=c-l}function N(){var e=new Date;return e.getTime()-i}function C(e,t,n,r,i){return{x:e+(n-e)*i,y:t+(r-t)*i}}function k(e,t,n){var r=C(e[0],e[1],t[0],t[1],n);var i=C(e[2],e[3],t[2],t[3],n);return[r.x,r.y,i.x,i.y]}function L(e,t){var n=e[2]-e[0];var r=e[3]-e[1];var i=(e[2]+e[0])/2;var s=(e[3]+e[1])/2;var o=n*t;var u=r*t;return[i-o/2,s-u/2,i+o/2,s+u/2]}function A(e,t,n,r){var i=n/r;var s=t*i;var o=t;if(s>e){s=e;o=e/i}var u=(e-s)/2;var a=(t-o)/2;return[u,a,u+s,a+o]}function O(e,t){var n=x[e];if(!n.initialized){var r=new Image;n.image=r;n.loaded=false;r.onload=function(){n.loaded=true;var i=r.width;var u=r.height;var f=A(i,u,s,o);var l=L(f,a);var c=Math.floor(Math.random()*3)-1;var h=Math.floor(Math.random()*3)-1;c/=2;h/=2;var p=l[0];l[0]+=p*c;l[2]+=p*c;var d=l[1];l[1]+=d*h;l[3]+=d*h;if(e%2){n.r1=f;n.r2=l}else{n.r1=l;n.r2=f}if(t){t()}};n.initialized=true;r.src=n.path}return n}function M(t,n){var r=50;if(e(window).width()<=1024){r=0}if(t!==""){var i=e(".kenburntext .kenburntextcontent").get(t);e(" > div",i).each(function(t){var n=e(this);setTimeout(function(){e(n).animate({"margin-left":"-"+r,opacity:0})},100*t)});setTimeout(function(){e(i).hide()},(e(" > div",i).length+1)*200)}setTimeout(function(){var t=e(".kenburntext .kenburntextcontent").get(n);e(t).show();e(" > div",t).each(function(t){var n=e(this);setTimeout(function(){e(n).css("margin-left",r).animate({"margin-left":0,opacity:1})},100*t)})},800)}function _(t,i,u){if(++w===1){e(".preloader").fadeOut(500);n.hide().fadeIn(2e3,function(){})}if(i>1){return}var a=O(t);if(a.loaded){var f=k(a.r1,a.r2,i);var l=Math.min(1,u);if(l>0){r.save();r.globalAlpha=Math.min(1,l);r.drawImage(a.image,f[0],f[1],f[2]-f[0],f[3]-f[1],0,0,s,o);r.restore()}}}function D(){r.save();r.globalAlpha=1;r.fillStyle=f;r.fillRect(0,0,r.canvas.width,r.canvas.height);r.restore()}function P(){var e=N();var i=e-b;_(H(m),i/l,i/c);if(t.post_render_callback){t.post_render_callback(n,r)}var s=H(m+1);O(s)}function H(e){return(e+x.length)%x.length}function B(t){e(".kennav li").removeClass("active");e(e(".kennav li").get(t)).addClass("active")}function j(t){var n=e(t.target).data("seq");clearTimeout(y);m=n;F()}function F(){b=N();E=H(m);if(S!==E){M(S,E);S=E}B(H(m));y=setTimeout(function(){m++;F()},l-c)}function I(){e(".kennav li").bind("click",j);O(0,function(){i=N();F();g=setInterval(P,v)})}function q(n){var r=new Image;e(r).load(function(){if(t.images.length-1>n){q(++n)}else{e(".kennav").fadeIn();e(".sliderloader").fadeOut();I()}}).attr("src",t.images[n])}var n=e(this);var r=this[0].getContext("2d");var i=null;var s=n.width();var o=n.height();var u=t.images;var a=1/(t.zoom||2);var f=t.background_color||"#000000";var l=t.display_time||7e3;var c=Math.min(l/2,t.fade_time||1e3);var h=l-c*2;var p=c-l;var d=t.frames_per_second||30;var v=1/d*1e3;var m=0;var g;var y=null;var b=null;var w=0;var E="";var S="";var x=[];e(u).each(function(e,t){x.push({path:t,initialized:false,loaded:false})});q(0);return{utils:{fadeOut:function(e){n.fadeOut(e)},fadeIn:function(){n.fadeIn(1e3)}},stop:function(){clearInterval(g);clearTimeout(y);e(".kennav li").unbind("click",j)}}}})(jQuery,undefined)