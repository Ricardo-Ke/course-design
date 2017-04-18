import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';
import cloud from 'd3-cloud';

import { FrequentlyTerm } from 'app/model/FrequentlyTerm';
import { DatasetService } from 'app/service/dataset.service';

// const cloud = require('d3-cloud');

@Component({
  selector: 'app-hot-words',
  templateUrl: './hot-words.component.html',
  styleUrls: ['./hot-words.component.css']
})
export class HotWordsComponent implements OnInit {

  private webServiceUrl: string;
  private terms: {
    Omics_description: FrequentlyTerm[],
    Omics_data_protocol: FrequentlyTerm[],
    Omics_sample_protocol: FrequentlyTerm[]
  };

  private hotwordsName = 'hotwords';
  private body: any;
  private divWidth: number;
  private fill: string[];
  private field: string;

  constructor(datasetService: DatasetService) {
    this.webServiceUrl = datasetService.getWebServiceUrl();
    this.body = d3.select('#' + this.hotwordsName);
    this.fill = d3.schemeCategory20b;
    this.field = '';
    this.terms = {
      Omics_description: [],
      Omics_data_protocol: [],
      Omics_sample_protocol: [] 
    }
  }

  ngOnInit() {
    this.startRequest();
  }

  private startRequest() {
    let webServiceUrl = this.webServiceUrl;

    d3.queue()
      .defer(d3.json, webServiceUrl+'term/frequentlyTerm/list?size=40&domain=omics&field=description')
      .defer(d3.json, webServiceUrl+'term/frequentlyTerm/list?size=40&domain=omics&field=data_protocol')
      .defer(d3.json, webServiceUrl+'term/frequentlyTerm/list?size=40&domain=omics&field=sample_protocol')
      .await((error: any, omicsDes: FrequentlyTerm[], omicsDatap: FrequentlyTerm[], omicsSamp: FrequentlyTerm[]) => {
        this.drawWordCloud(error, omicsDes, omicsDatap, omicsSamp);
      });
  }

  private drawWordCloud(error: any, omicsDes: FrequentlyTerm[], omicsDatap: FrequentlyTerm[], omicsSamp: FrequentlyTerm[]): void {
    let self = this;

    if (error) {
      this.outputErrorInfo();
      return;
    }

    self.terms.Omics_description = omicsDes;
    self.terms.Omics_data_protocol = omicsDatap;
    self.terms.Omics_sample_protocol = omicsSamp;
    self.field = '';
    
    self.addWordCloudOrChange();  //draw wordcloud
    self.addInputAndLabel();      //draw form input and label
    self.addWordCloudToolTip();   //draw wordcloud tooltip

    // give different namespace after 'resize' to add window listener
    d3.select(window).on('resize.hotwords', function() { self.addWordCloudOrChange() });  //add window resize event listener
    
  }

  private addWordCloudToolTip(): void {
    let wordcloud_tooltip = document.getElementById('word_cloud_chart_tooltip');
    if (wordcloud_tooltip == null) {
      d3.select("#" + this.hotwordsName)
        .append("div")
        .attr("class", "chart_tooltip")
        .attr("id", "word_cloud_chart_tooltip")
        .style("opacity", 0);
    }
  }

  private addInputAndLabel(): void {
    let self = this;

    d3.select("#" + self.hotwordsName).selectAll("div").remove();

    let formdiv = d3.select("#" + self.hotwordsName).append('div');

    formdiv
      .attr("class", "center");

    let radio_form = formdiv.append('form');
    radio_form
      .attr("id", self.hotwordsName + "_form")
      .attr("class", "center")
      .append('label')
      .text('Description')
      .attr('for', 'description')
      .append('span')
      .append('span');
    radio_form
      .append('input')
      .attr('type', 'radio')
      .attr('name', 'dataset')
      .attr('value', 'description')
      .attr('id', 'description')
      .text('Description');
    radio_form
      .append('label')
      .text('Sample')
      .attr('for', 'sample')
      .append('span')
      .append('span');
    radio_form
      .append('input')
      .attr('type', 'radio')
      .attr('name', 'dataset')
      .attr('value', 'sample_protocol')
      .attr('id', 'sample')
      .text('Sample');
    radio_form
      .append('label')
      .text('Data')
      .attr('for', 'data')
      .append('span')
      .append('span');
    radio_form
      .append('input')
      .attr('type', 'radio')
      .attr('name', 'dataset')
      .attr('value', 'data_protocol')
      .attr('id', 'data')
      .text('Data');
    
    d3.select("#hotwords_form").select('input[value=description]').property('checked', true);

    d3.select("#hotwords_form")
      .selectAll('input')
      .on('click', function(d, i, ele) { 
        self.field = d3.select(this).attr('value');        //ignore this exception raised by editor
        self.addWordCloudOrChange();
      })
  }

  private addWordCloudOrChange(): void {
    let self = this
      , body = d3.select('#' + self.hotwordsName)
      , divWidth = self.divWidth  = parseInt(body.style('width'))
      , svg = body.select('#word_cloud_svg')
      , wordcloud_tooltip: any = d3.select('#word_cloud_chart_tooltip');

    if (svg.empty()) {
      svg = body.append('svg')
        .attr('id', 'word_cloud_svg')
        .attr('class', 'wordcloud')
        .attr('height', 325);
    }

    if (wordcloud_tooltip.empty()) {
      d3.select("#" + self.hotwordsName)
        .append("div")
        .attr("class", "chart_tooltip")
        .attr("id", "word_cloud_chart_tooltip")
        .style("opacity", 0);
    }

    svg.attr('width', divWidth);

    self.field = self.field || 'description';
    let thisField = self.field
      , hotwordss = self.terms['Omics_' + thisField]
      , maxfrequent = self.getMax(hotwordss);

    let fontSizePara = 45;
    if (thisField == 'description') { fontSizePara = 60 };
    if (thisField == 'sample_protocol') { fontSizePara = 40 };
    if (thisField == 'data_protocol') { fontSizePara = 45 };

    svg.selectAll('.cloud').remove();
    cloud().size([divWidth - 10, 325])
      .words(hotwordss)
      .padding(1)
      .rotate(0)
      .font("Impact")
      .text(function (d) {
        return d.label;
      }) // THE SOLUTION
      .fontSize(function (d) {
        return Math.sqrt(d.frequent) / Math.sqrt(maxfrequent) * fontSizePara * divWidth / 500;
      })
      .on("end", function(ws) { self.draw(ws, fontSizePara); })
      .start();
    
  }

  private draw(words: any[], fontSizePara: number): void{
    let self = this
      , maxfrequent = self.getMax(words)
      , svg = d3.select('#word_cloud_svg');

    svg.append('g')
      .attr('class', 'cloud')
      .attr('transform', 'translate(' + self.divWidth / 2.2 + ',160)')
      .selectAll('text')
      .data(words)
      .enter()
      .append('text')
      .style('font-size', function(d: any) {
        return Math.sqrt(parseInt(d.frequent)) / Math.sqrt(maxfrequent) * fontSizePara * self.divWidth / 500 + 'px';
      })
      .style("font-family", "Impact")
      .style("fill", function (d, i) {
        return self.fill[i % self.fill.length];
      })
      .attr("text-anchor", "middle")
      .attr("transform", function (d: any) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d: any) {
        return d.label;
      })
      .attr("class", "hotword")
      .on("click", function (d: any, i) {

        d3.select('#word_cloud_chart_tooltip')
          .style('opacity', 0);
        // var searchWord = "\"" + d.label + "\"";
        // angular.element(document.getElementById('queryCtrl')).scope().meta_search(searchWord);
        // redirect logic remains to do
      })
      .on("mousemove", function (d, i) {
        let wordcloud_tooltip = d3.select('#word_cloud_chart_tooltip')
          , mouse_coords = d3.mouse(document.getElementById('word_cloud_svg'));

        wordcloud_tooltip.style("opacity", .9);

        wordcloud_tooltip.html("<strong>" + d.frequent + "</strong> datasets")
          .style("left", (mouse_coords[0] + 25) + "px")
          .style("top", (mouse_coords[1] - 25) + "px");
      })
      .on("mouseout", function (d, i) {
        d3.select('#word_cloud_chart_tooltip')
          .style("opacity", 0);
      });
  }

  private getMax(arr: FrequentlyTerm[]): number {
    if (!arr || !Array.isArray(arr)) return null;
    return arr.reduce((max, val) => {
      let intFre = parseInt(val.frequent);
      return max > intFre ? max : intFre;
    }, 0)
  }

  private outputErrorInfo() {
    d3.select('#' + this.hotwordsName)
      .append('p')
      .attr('class', 'error-info')
      .html('Sorry, accessing to the word cloud web service was temporally failed.');
  }

}
