'use strict';
/*eslint-env mocha*/
/*jshint expr: true*/
/*jshint multistr: true*/
var chai = require('chai');
var expect = chai.expect;
var assemble = require('assemble');
var through = require('through2');
var app;

var Navigation = require('../');

describe('Middleware', function () {
  var navi;
    beforeEach(function () {
      navi = new Navigation({'menus': ['main', 'footer']});
      app = assemble();
      if (!app.pages) {
        app.create('pages');
      }
      app.pages.onLoad(/\.hbs$|\.md$/, navi.onLoad());
      app.pages.preRender(/\.hbs$|\.md$/, navi.preRender());
    });

    it('should create menu items from pages', function (){
      app.pages('test/mocks/middleware/**/*.{md,hbs}');
      //console.log(JSON.stringify(navi.menus.main.items, null, '\t'));
      expect(navi.menus.main.items.length).to.be.at.least(2);
    });

    it('should add navigation to each page', function () {
      app.pages('test/mocks/middleware/**/*.{md,hbs}');
      
      var page = app.pages.getView('index.hbs');
      app.render(page, function(err, res) {
        if (err) return cb(err);
        //console.log(res.context());
        expect(file.context().navigation).to.be.an('object');
        cb();
      });
      //console.log(JSON.stringify(navi.menus.main, null, '\t'));
    });

    it('should group siblings under same parent item', function () {
      app.pages('test/mocks/middleware/**/*.{md,hbs}');
      // app.toStream('pages')
      // .pipe(app.renderFile())
      //.pipe(streamReader());
      console.log(JSON.stringify(navi.menus, null, '\t'));
      expect(navi.menus.main.items.length).to.equal(3);
    });

    var streamReader = function () {
      console.log('calling streaminspector');

      return through.obj(function (file, enc, next) {
        console.log('relative path: ', file.relative);
        console.log('File context: ', file.context());
        console.log('Contents: \n', file.contents.toString());

        expect(file.context().navigation).to.be.an('object');

        next(null, file);
      });
    };
});