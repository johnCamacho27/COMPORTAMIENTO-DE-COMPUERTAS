import { Component, NgZone, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Observer, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { SettingsService } from '@core';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, tap } from 'rxjs/operators';

import { ControlService } from '../control.service';


/// Apertura de Puerta Ecologica
// Interfaces de Datos Socket
export interface Iesp4 {
  message: string
  espConf: EspConf
  dataSave: DataSave[] // listado de rejillas configuradas inicalmente
  dataSend: DataSave // datos de la regilla que esta operando
  dataHistoric?: DataSave[]
}


/// nota: Posicion_Compuerta_Ecolo: number => 0 = Quieta, 1 = abriendo, 2 = cerrando

export interface DataSave {
  ID: string
  sortKey: number
  Presion_Aceite: string
  Temp_Aceite: string
  Nivel_Aceite: string
  Pos_Compu_Radial: number
  Est_Motor: string
  Estado_Compuerta_Radial: number
  Motor: number
  Alarm_Pres_Aceite: number
  Alarm_Niv_Aceite: number
  Alarm_Temp_Aceite:number
}

export interface EspConf {
  ID: string
  Acti_Alarm_Fallas: number
  Acti_Mod_Comp_Radial: number
  Limt_Max_Presion: number
  Limt_Max_Temperatura: number
  Limt_Baj_Niv_Aceite: number
  Tiemp_Sost_Max_Presion: number
  Tiemp_Sost_Max_Temperatura: number
  Tiemp_Sost_Baj_Niv_Aceite: number
}


// ApexChart
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexTooltip,
} from "ng-apexcharts";
import { title } from 'process';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: any; //ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  grid: any; //ApexGrid;
  colors: any;
  toolbar: any;
};



@Component({
  selector: 'app-visor-control-esp-four',
  templateUrl: './esp-four.component.html',
  styleUrls: ['./esp-four.component.scss']
})
export class VisorControlEspFourComponent implements OnInit {



  // Data Charts
  dpa: any = [];
  dta: any = [];
  dna: any = [];
  dapa: any = [];
  data: any = [];
  dana: any = [];
  dpcr: any = [];



  // charts
  // charts
  @ViewChild("chart")  chart: ChartComponent = new ChartComponent;

  public chartOptions!: Partial<ChartComponent> | any;
  public chart1options!: Partial<ChartOptions> | any;
  public chart2options!: Partial<ChartOptions> | any;
  public chart3options!: Partial<ChartOptions> | any;
  public chartA1options!: Partial<ChartOptions> | any;
  public chartA2options!: Partial<ChartOptions> | any;
  public chartA3options!: Partial<ChartOptions> | any;
  public commonOptions: Partial<ChartOptions> | any = {
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "straight"
    },
    toolbar: {
      tools: {
        selection: false
      }
    },
    markers: {
      size: 6,
      hover: {
        size: 10
      }
    },
    tooltip: {
      followCursor: false,
      theme: "dark",
      x: {
        show: false
      },
      marker: {
        show: false
      },
      y: {
        title: {
          formatter: function() {
            return "";
          }
        }
      }
    },
    grid: {
      clipMarkers: false
    },
    xaxis: {
      type: "datetime",
      title: {
        text: "Tiempo"
      },
    }
  };





  stats = {
    title_tsc: 'Compuerta Radial',
    title_tstc: 'T. sostenimiento Tanque de Carga',
    amount_ssc: 50.200,
    amount_sstc: 180.200,
    date: new Date(),
    progress: {
      value_ssc: 50,
      value_sstc: 180,
    },
    configuration: {
      time_tsc: 2,
      time_tstc: 4,
      limite_cssc: 80,
      limite_csstc: 100,
      alarm_cssc: 2,
      alarm_csstc: 2
    },
    color_sc: 'bg-indigo-500',
    color_stc: 'bg-blue-500',
  };


  // chart
  compuertaChart = null;
  options = {
    chart: {
      height: 280,
      type: "radialBar",
      foreColor: '#eeeeee', // color del texto
    },

    series: [0],
    colors: ["#20E647"],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: "70%",
          background: "#293450"
        },
        track: {
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15
          }
        },
        dataLabels: {
          name: {
            offsetY: -10,
            color: "#fff",
            fontSize: "13px"
          },
          value: {
            color: "#fff",
            fontSize: "30px",
            show: true
          }
        }
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        gradientToColors: ["#87D4F9"],
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: "round"
    },
    labels: ["Compuerta Radial"]
  }


  compuertaHChart = null;
  optionsHC = {
    series: [
      {
        name: "Historicos Posicion de la Compuerta",
        data: []
      }
    ],
    chart: {
      height: 350,
      type: "line",
      foreColor: '#eeeeee', // color del texto
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: false
      }
    },
    colors: ["#77B6EA"],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth"
    },
    title: {
      text: "Posicion de la Compuerta Radial",
      align: "left",
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.1
      }
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      title: {
        text: "Tiempo"
      },
      colors: "#77B6EA",
    },
    yaxis: {
      title: {
        text: "Posición",
        colors: ["#77B6EA"],
      },
      colors: "#77B6EA",
      min: 0,
      max: 100
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
  };

  // input

  states = [
    { code: '0', name: '0' },
    { code: '25', name: '25' },
    { code: '50', name: '50' },
    { code: '75', name: '75' },
    { code: '100', name: '100' },
  ];

  active: boolean = true;
  value: number = 10;
  filteredStates = this.states;

  // list
  messages = [
    {
      img: 'assets/images/avatars/aceite_img.svg',
      subject: 'Presion de Aceite',
      content: `Presion actual del aceite.`,
      state: '0',
      state_cl: "bg-green-500",
    },
    {
      img: 'assets/images/avatars/temperatura_aceite.svg',
      subject: 'Temperatura del Aceite',
      content: `Estado actual de la temperatura del Aceite.`,
      state: '0',
      state_cl: "bg-orange-500",
    },
    {
      img: 'assets/images/avatars/nivel_aceite.svg',
      subject: 'Nivel de Aceite',
      content: `Nivel del Aceite Actual.`,
      state: '0',
      state_cl: "bg-red-500",
    },
    {
      img: 'assets/images/avatars/motor.svg',
      subject: 'Motor',
      content: `Estado actual del Motor.`,
      state: '?',
      state_cl: "bg-green-500",
    }
  ];

  time = new Observable<string>((observer: Observer<string>) => {
    setInterval(() => observer.next(new Date().toString()), 1000);
  });

  notifySubscription: Subscription;


  // form cofigutarion

  // Advanced Layout
  // configuracion de Red
  // Advanced Layout
  form1 = new FormGroup({});
  model1: any = {};
  options1: FormlyFormOptions = {};

  fields1: FormlyFieldConfig[] = [
    {
      type: 'input',
      key: 'nameRed',
      templateOptions: {
        label: 'Nombre de la Red',
      },
    },
    {
      type: 'input',
      key: 'passwordRed',
      templateOptions: {
        type: 'password',
        label: 'Password de la red',
        placeholder: 'Minimo 3 caracteres',
        required: true,
        minLength: 3,
      },
    },
  ];

  // configuracion modulo
  form2 = new FormGroup({});
  model2: any = {};
  options2: FormlyFormOptions = {
    formState: {
      awesomeIsForced: false,
    },
  };

  fields2: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'albc',
          type: 'toggle',
          className: 'col-sm-6',
          templateOptions: {
            label: 'Activación de Alarmas',
            description: '',
            required: false,
          },
        },
        {
          key: 'amce',
          type: 'toggle',
          className: 'col-sm-6',
          templateOptions: {
            label: 'Activación de Modulo Compuerta Radial',
            description: '',
            required: false,
            onClick: ($event) => console.log('You clicked me!'),
          },
        },
        {
          key: 'lmp',
          type: 'input',
          className: 'col-sm-4',
          templateOptions: {
            label: 'Minima Presion de Aceite [PSI]',
            description: '',
            required: false,
          }
        },
        {
          key: 'lmt',
          type: 'input',
          className: 'col-sm-4',
          templateOptions: {
            label: 'Temperatura Maxima de Aceite [°C]',
            description: '',
            required: false,
          }
        },
        {
          key: 'lbna',
          type: 'input',
          className: 'col-sm-4',
          templateOptions: {
            label: 'Minimo Nivel de Aceite [cm]',
            description: '',
            required: false,
          }
        },
        {
          key: 'tsmp',
          type: 'input',
          className: 'col-sm-4',
          templateOptions: {
            label: 'Tiempo de Sostenimiento de Presion [s]',
            description: '',
            required: false,
          }
        },
        {
          key: 'tsmt',
          type: 'input',
          className: 'col-sm-4',
          templateOptions: {
            label: 'Tiempo de sostenimiento de Temperatura [s]',
            description: '',
            required: false,
          }
        },
        {
          key: 'tsbna',
          type: 'input',
          className: 'col-sm-4',
          templateOptions: {
            label: 'Tiempo de Sostenimiento de Nivel de Aceite [s]',
            description: '',
            required: false,
          }
        },
      ],
    },
    {
      type: 'checkbox',
      key: 'confirm',
      templateOptions: {
        label: 'Confirmar',
      },
    },
  ];

  compuertaRadial: number = 0;

  motor: number = 0;

  data$ = this.service.messages$.pipe(
    map((d:Iesp4) => {

      //console.log(" --- ",d)

      if (d.message === 'HISTORICO') {
        this.getSeriesHistorico(d.dataHistoric);
      }


      if ( d.espConf != undefined && d.espConf.ID === 'esp4#1004' ) {
            //console.log("compuerta: ", d.espConf, ' - ', d.dataSave);
            this.loadConfigESP( d.espConf );
      }

      if ( d.dataSend != undefined && d.dataSend.ID === 'esp4#1004' ) {
            console.log("Data: ", d.dataSend);
            this.messages[0].state = d.dataSend.Presion_Aceite + ' psi';
            this.messages[0].state_cl = d.dataSend.Alarm_Pres_Aceite === 1? "bg-red-500" : "bg-green-500";
            this.messages[1].state = d.dataSend.Temp_Aceite + ' °C';
            this.messages[1].state_cl = d.dataSend.Alarm_Temp_Aceite === 1? "bg-red-500" : "bg-green-500";
            this.messages[2].state = d.dataSend.Nivel_Aceite + ' cm' ;
            this.messages[2].state_cl = d.dataSend.Alarm_Niv_Aceite === 1? "bg-red-500" : "bg-green-500";
            this.messages[3].state = d.dataSend.Est_Motor;
            this.messages[3].state_cl = d.dataSend.Est_Motor === "Normal"? "bg-green-500" : "bg-red-500";

            this.motor = d.dataSend.Motor;

            this.compuertaRadial = d.dataSend.Estado_Compuerta_Radial;

            this.active = this.compuertaRadial != 0? true : false;

            this.filter(d.dataSend.Pos_Compu_Radial);
            this.compuertaRadial = d.dataSend.Estado_Compuerta_Radial;
      }

    }),
    catchError(error => { throw error }),
    tap({
      error: error => console.log('Error:', error),
      complete: () => console.log('Connection Closed')
    })
  );

  // Search Date
  group: FormGroup;
  today: moment.Moment;
  min: moment.Moment;
  max: moment.Moment;
  tomorrow: moment.Moment;


  constructor(
                private ngZone: NgZone,
                private settings: SettingsService,
                private service: ControlService,
                public snackBar: MatSnackBar,
                private toastr: ToastrService,
                private fb: FormBuilder,
  ) {
    this.initCharts();

    this.group = fb.group({
      dateTime: [new Date(), Validators.required],
    });

  }


  public initCharts(): void {

    this.chart1options = {
      series: [
        {
          name: "Presion de Aceite",
          data: []
        }
      ],
      chart: {
        id: "pa",
        group: "estado",
        type: "line",
        foreColor: '#eeeeee', // color del texto
        height: 160
      },
      colors: ["#008FFB"],
      yaxis: {
        title: {
          text: "Presion de Aceite",
          colors: ["#77B6EA"],
        },
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart2options = {
      series: [
        {
          name: "Temperatura del Aceite",
          data: []
        }
      ],
      chart: {
        id: "ta",
        group: "estado",
        type: "line",
        foreColor: '#eeeeee', // color del texto
        height: 160
      },
      colors: ["#546E7A"],
      yaxis: {
        title: {
          text: "Temperatura de Aceite",
          colors: ["#77B6EA"],
        },
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chart3options = {
      series: [
        {
          name: "Nivel de Aceite",
          data: []
        }
      ],
      chart: {
        id: "na",
        group: "estado",
        type: "area",
        foreColor: '#eeeeee', // color del texto
        height: 160
      },
      colors: ["#00E396"],
      yaxis: {
        title: {
          text: "Nivel de Aceite",
          colors: ["#77B6EA"],
        },
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chartA1options = {
      series: [
        {
          name: "Alarma Presion de Aceite",
          data: []
        }
      ],
      chart: {
        id: "apa",
        group: "alarma",
        type: "line",
        foreColor: '#eeeeee', // color del texto
        height: 160
      },
      colors: ["#008FFB"],
      yaxis: {
        title: {
          text: "Alarm. Presion A.",
          colors: ["#77B6EA"],
        },
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chartA2options = {
      series: [
        {
          name: "Alarma Temperatura del Aceite",
          data: []
        }
      ],
      chart: {
        id: "ata",
        group: "alarma",
        type: "line",
        foreColor: '#eeeeee', // color del texto
        height: 160
      },
      colors: ["#546E7A"],
      yaxis: {
        title: {
          text: "Alarm. Temperatura A.",
          colors: ["#77B6EA"],
        },
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

    this.chartA3options = {
      series: [
        {
          name: "Alarma Nivel de Aceite",
          data: []
        }
      ],
      chart: {
        id: "ana",
        group: "alarma",
        type: "area",
        foreColor: '#eeeeee', // color del texto
        height: 160
      },
      colors: ["#00E396"],
      yaxis: {
        title: {
          text: "Alarm. Nivel A.",
          colors: ["#77B6EA"],
        },
        tickAmount: 2,
        labels: {
          minWidth: 40
        }
      }
    };

  }


  public dateTimeSeries(dpa, dta, dna, dapa, data, dana, dpcr) {

    this.chart1options.series = ([
      {
        data: dpa
      },
    ]);

    this.chart2options.series = ([
      {
        data: dta
      },
    ]);

    this.chart3options.series = ([
     {
        data: dna
     }
    ]);

    this.chartA1options.series = ([
      {
        data: dapa
      }
    ]);

    this.chartA2options.series = ([
      {
        data: data
      }
    ]);

    this.chartA3options.series = ([
      {
        data: dana
      }
    ]);

    let s =[
      {
        name: "Historicos Posicion de la Compuerta",
        data: dpcr
      }
    ]

    this.optionsHC.series =  s;
  }

  getSeriesHistorico(data: DataSave[]) {

    ///console.log("DATA HISTORICO: ",data);
    data.forEach( d => {
      //console.log("data", d);
      this.dpa.push([ d.sortKey-18000000, d.Presion_Aceite]);
      this.dta.push([ d.sortKey-18000000, d.Temp_Aceite]);
      this.dna.push([ d.sortKey-18000000, d.Nivel_Aceite]);

      this.dapa.push([ d.sortKey-18000000, d.Alarm_Pres_Aceite]);
      this.data.push([ d.sortKey-18000000, d.Alarm_Temp_Aceite]);
      this.dana.push([ d.sortKey-18000000, d.Alarm_Niv_Aceite]);

      this.dpcr.push([ d.sortKey-18000000, d.Pos_Compu_Radial]);

    });

    //console.log(this.dpa, this.dta, this.dna, this.dapa, this.data, this.dana, this.dpcr)

    this.dateTimeSeries(  this.dpa.reverse(),
                          this.dta.reverse(),
                          this.dna.reverse(),
                          this.dapa.reverse(),
                          this.data.reverse(),
                          this.dana.reverse(),
                          this.dpcr.reverse());
  }

  public generateDayWiseTimeSeries(baseval: any, count: any, yrange: any): any[] {
    let i = 0;
    let series = [];
    while (i < count) {
      var x = baseval;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }


  ngOnInit() {
        // Init Observable Socket
        this.data$.subscribe();

        // Conection Server Inicializa el Socket y se conecta
        this.service.connect(); // se debe conectar y luego configurar

  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => this.initChart());

    this.service.sendMessage({
                                "action":"config",
                                "message":"APP",
                                "esp":"esp4#1004",
    });

  }


  ngOnDestroy() {
    if (this.compuertaChart) {
      this.compuertaChart.destroy();
    }
  }

  initChart() {
    this.compuertaChart = new ApexCharts(document.querySelector('#chart1'), this.options);
    this.compuertaChart.render();
  }

  start() {

    if(this.value > 100 ) this.value = 100;

    console.warn('start open', this.value);

    let dataStartClean =   {
                            "action":"control",
                            "message":"ESPM4",
                            "espCLIENT":"esp4",
                            "espCode":"1004",
                            "control":"action",
                            "Consig_Apertura": this.value,
                            "Ejecutar_Consig":1,
                            "Parar_Accion":0
    }

    this.service.sendMessage(dataStartClean);
  }

  stop() {
    console.warn('stop open');

    // if(this.value > 100 ) this.value = 100;

    let dataStopClean =   {
                            "action":"control",
                            "message":"ESPM4",
                            "espCLIENT":"esp4",
                            "espCode":"1004",
                            "control":"action",
                            "Consig_Apertura": this.value,
                            "Ejecutar_Consig":0,
                            "Parar_Accion":1
    }

    this.service.sendMessage(dataStopClean);

  }

  // forms
  // sumit form configuration
  getHistorico() {

    let date = this.group.value;
    let fecha = new Date(date.dateTime).getTime();

    console.log('fecha del Historico: ', fecha)

    let dataConf =   {
                        "action":"config",
                        "message":"HISTORICO",
                        "esp":"esp4#1004",
                        "date": fecha
                      }

    //this.showToast(dataConf);
    this.showToast('Consulta Historico de ESP Modulo 5');
    this.service.sendMessage(dataConf);

  }

  // helpers

  // helpers
  activeInput() {

    if (this.compuertaRadial != 0) {
        this.active = true
    }else {
        this.active = false
    }

  }


  // input
  filter(value: number) {
    this.compuertaChart.updateSeries([value]);
    this.activeInput();
  }

  loadConfigESP( data : EspConf ) {
    this.model2 = {
      albc: Number(data.Acti_Alarm_Fallas) === 1? true : false,
      amce: Number(data.Acti_Mod_Comp_Radial) === 1? true : false,
      lmp: data.Limt_Max_Presion,
      lmt: data.Limt_Max_Temperatura,
      lbna: data.Limt_Baj_Niv_Aceite,
      tsmp: data.Tiemp_Sost_Max_Presion,
      tsmt: data.Tiemp_Sost_Max_Temperatura,
      tsbna: data.Tiemp_Sost_Baj_Niv_Aceite
    }
  }

   // forms

  // sumit form configuration
  submit1() {
    if (this.form1.valid) {
      this.showToast(this.model1);
    }
  }

  submit2() {
    if (this.form2.valid) {

      this.activeInput();

      let dataConf = {
                        "action":"control",
                        "message":"ESPM4",
                        "espCLIENT":"esp4",
                        "espCode":"1004",
                        "control":"config",
                        "Acti_Alarms": this.model2.albc? 1 : 0,
                        "Acti_Mod_Comp_Radial": this.model2.amce? 1 : 0,
                        "Limt_Max_Presion":this.model2.lmp,
                        "Limt_Max_Temperatura":this.model2.lmt,
                        "Limt_Baj_Niv_Aceite":this.model2.lbna,
                        "Tiemp_Sost_Max_Presion":this.model2.tsmp,
                        "Tiemp_Sost_Max_Temperatura":this.model2.tsmt,
                        "Tiemp_Sost_Baj_Niv_Aceite":this.model2.tsbna
      }

      this.service.sendMessage( dataConf );
      this.showToast(dataConf);
    }
  }

  showToast(obj: any) {
    this.toastr.success(JSON.stringify(obj));
  }



}
