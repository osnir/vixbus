import React, { useState, useEffect } from 'react';
import styles from '../styles/index'
import Api from '../services/Api';
import { Picker } from '@react-native-community/picker';
import NetInfo from "@react-native-community/netinfo";
import {
   View, 
   Text, 
   Alert, 
   Image, 
   FlatList, 
   TouchableOpacity, 
   ScrollView, 
   ActivityIndicator 
} from 'react-native';

export default function Home() {

    const [loading, setLoading] = useState(false);
    const [opcao, setOpcao] = useState({});
    const [opcoes, setOpcoes] = useState([]) 
    const [linha, setLinha] = useState({});
    const [linhas, setLinhas] = useState([]);
    const [observacoes, setObservacoes] = useState([]);
    
    const [itinerario, setItinerario] = useState({});
    const [itinerariosId, setItinerariosId] = useState([]);
    const [itinerariosVo, setItinerariosVo] = useState([]);

    const [saidaBairro, setSaidaBairro] = useState(null);
    const [saidaTerminal, setSaidaTerminal] = useState(null);
    
    const [bairroU, setBairroU] = useState([]);
    const [bairroS, setBairroS] = useState([]);
    const [bairroD, setBairroD] = useState([]);
    const [bairroA, setBairroA] = useState([]);
    const [terminU, setTerminU] = useState([]);
    const [terminS, setTerminS] = useState([]);
    const [terminD, setTerminD] = useState([]);
    const [terminA, setTerminA] = useState([]);

    const [bairroHoraDiaUtil, setBairroHoraDiaUtil] = useState({});
    const [bairroHoraSabado, setBairroHoraSabado] = useState({});
    const [bairroHoraDomingo, setBairroHoraDomingo] = useState({});
    const [bairroHoraAtipico, setBairroHoraAtipico] = useState({});
    const [terminHoraDiaUtil, setTerminHoraDiaUtil] = useState({});
    const [terminHoraSabado, setTerminHoraSabado] = useState({});
    const [terminHoraDomingo, setTerminHoraDomingo] = useState({});
    const [terminHoraAtipico, setTerminHoraAtipico] = useState({});
    
    const [showBairro, setShowBairro] = useState(false);
    const [showBairroSabado, setShowBairroSabado] = useState(false);
    const [showBairroDomingo, setShowBairroDomingo] = useState(false);
    const [showBairroAtipico, setShowBairroAtipico] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);
    const [showTerminalSabado, setShowTerminalSabado] = useState(false);
    const [showTerminalDomingo, setShowTerminalDomingo] = useState(false);
    const [showTerminalAtipico, setShowTerminalAtipico] = useState(false);
    
    useEffect(() => {
      verifyConnection();        

      setLinhas([ { Linha: "", Descricao: "SELECIONE A LINHA DESEJADA" } ]);
      setOpcao({ Id: 1, Descricao: "HORÁRIOS" });
      setOpcoes(
        [   
          { Id: 1, Descricao: "HORÁRIOS" },
          { Id: 2, Descricao: "ITINERÁRIOS" }        
        ]
      );      
    }, []);

    async function verifyConnection() {
      await NetInfo.fetch().then(state => {
        if (state.isConnected) {
          loadLinhasTipoS();
        }    
      });
    };

    async function loadLinhasTipoS() {
      await NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          Alert.alert("Erro", "Conexão de rede indisponível");
          return;
        }

        setLoading(true);

        Api.get('/ConsultaLinha/?Tipo_Linha=S')
        .then((resp) => {
          loadLinhasTipoT(resp.data);
        })
        .catch((error) => {      
          Alert.alert("Erro", "Erro ao carregar linhas");          
        })
        .finally(() => {
          setLoading(false);
        });     
      }); 
    };

    async function loadLinhasTipoT(linhasS) {
      Api.get('/ConsultaLinha/?Tipo_Linha=T')
      .then((resp) => {
        let array = linhasS;

        resp.data.forEach(e => { array.push(e); });
        array.unshift({ Linha: "", Descricao: "SELECIONE A LINHA DESEJADA" });

        setLinhas(array);
      });      
    };

    async function search() {
      await NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          Alert.alert("Erro", "Conexão de rede indisponível");
          return;
        }

        if (!linha.Linha) {
          Alert.alert("Erro", "Selecione a Linha");
          return;
        }

        if (opcao.Id === 1) {    
          loadHorarios();          
        } else {
          loadItineratios();
        }
      });
    };
    
    function loadHorarios() {
      setBairroU([]); 
      setBairroS([]);       
      setBairroD([]);
      setBairroA([]);        
      setTerminU([]); 
      setTerminS([]);
      setTerminD([]);       
      setTerminA([]);
      setObservacoes([]);

      setLoading(true);
      
      Api.get(`/BuscaHorarios/${linha.Linha}`)
      .then((resp) => {
        
        setShowBairro(false);
        setShowBairroSabado(false);
        setShowBairroDomingo(false);
        setShowBairroAtipico(false);        
        setShowTerminal(false);
        setShowTerminalSabado(false);
        setShowTerminalDomingo(false);
        setShowTerminalAtipico(false);

        // Saída do Bairro Dias Úteis
        let bairroUList = resp.data.filter(function(e) { return e.Terminal_Seq === 1 && e.TP_Horario === 1 });
        // Saída do Bairro Sábados
        let bairroSList = resp.data.filter(function(e) { return e.Terminal_Seq === 1 && e.TP_Horario === 2 });
        // Saída do Bairro Domingos e Feriados
        let bairroDList = resp.data.filter(function(e) { return e.Terminal_Seq === 1 && e.TP_Horario === 3 });
        // Saída do Bairro Dias Atípicos entre Feriados
        let bairroAList = resp.data.filter(function(e) { return e.Terminal_Seq === 1 && e.TP_Horario === 4 });
        // Saída do Terminal Dias Úteis
        let terminUList = resp.data.filter(function(e) { return e.Terminal_Seq === 2 && e.TP_Horario === 1 });
        // Saída do Terminal Sábados
        let terminSList = resp.data.filter(function(e) { return e.Terminal_Seq === 2 && e.TP_Horario === 2 });
        // Saída do Terminal Domingos e Feriados
        let terminDList = resp.data.filter(function(e) { return e.Terminal_Seq === 2 && e.TP_Horario === 3 });
        // Saída do Terminal Dias Atípicos entre Feriados
        let terminAList = resp.data.filter(function(e) { return e.Terminal_Seq === 2 && e.TP_Horario === 4 });

        bairroUList = nextHourU(bairroUList);
        bairroSList = nextHourS(bairroSList);
        bairroDList = nextHourS(bairroDList);
        terminUList = nextHourU(terminUList);
        terminSList = nextHourS(terminSList);
        terminDList = nextHourS(terminDList);

        setBairroU(bairroUList); 
        setBairroS(bairroSList);       
        setBairroD(bairroDList);
        setBairroA(bairroAList);        
        setTerminU(terminUList); 
        setTerminS(terminSList);
        setTerminD(terminDList);       
        setTerminA(terminAList); 

        const bairroUtil = bairroUList[0];
        const bairroSaba = bairroSList[0];
        const bairroDomi = bairroDList[0];
        const bairroAtip = bairroAList[0];
        const terminUtil = terminUList[0];
        const terminSaba = terminSList[0];
        const terminDomi = terminDList[0];
        const terminAtip = terminAList[0];

        if (bairroUtil) {
          setShowBairro(true);
          setSaidaBairro(bairroUtil.Desc_Terminal);
          setBairroHoraDiaUtil({
            "Descricao_Hora": bairroUtil.Descricao_Hora,
            "Descricao_Linha": bairroUtil.Descricao_Linha,
            "Desc_Terminal": bairroUtil.Desc_Terminal,
            "Dt_Inicio": bairroUtil.Dt_Inicio
          });
        }  

        if (bairroSaba) {
          setShowBairroSabado(true);
          setSaidaBairro(bairroSaba.Desc_Terminal);
          setBairroHoraSabado({
            "Descricao_Hora": bairroSaba.Descricao_Hora,
            "Descricao_Linha": bairroSaba.Descricao_Linha,
            "Desc_Terminal": bairroSaba.Desc_Terminal,
            "Dt_Inicio": bairroSaba.Dt_Inicio
          });
        }      

        if (bairroDomi) {
          setShowBairroDomingo(true);
          setSaidaBairro(bairroDomi.Desc_Terminal);
          setBairroHoraDomingo({
            "Descricao_Hora": bairroDomi.Descricao_Hora,
            "Descricao_Linha": bairroDomi.Descricao_Linha,
            "Desc_Terminal": bairroDomi.Desc_Terminal,
            "Dt_Inicio": bairroDomi.Dt_Inicio
          });
        }

        if (bairroAtip) {
          setShowBairroAtipico(true);
          setSaidaBairro(bairroAtip.Desc_Terminal);
          setBairroHoraAtipico({
            "Descricao_Hora": bairroAtip.Descricao_Hora,
            "Descricao_Linha": bairroAtip.Descricao_Linha,
            "Desc_Terminal": bairroAtip.Desc_Terminal,
            "Dt_Inicio": bairroAtip.Dt_Inicio
          });
        }

        if (terminUtil) {
          setShowTerminal(true);
          setSaidaTerminal(terminUtil.Desc_Terminal);
          setTerminHoraDiaUtil({
            "Descricao_Hora": terminUtil.Descricao_Hora,
            "Descricao_Linha": terminUtil.Descricao_Linha,
            "Desc_Terminal": terminUtil.Desc_Terminal,
            "Dt_Inicio": terminUtil.Dt_Inicio
          });
        }

        if (terminSaba) {
          setShowTerminalSabado(true);
          setSaidaTerminal(terminSaba.Desc_Terminal);
          setTerminHoraSabado({
            "Descricao_Hora": terminSaba.Descricao_Hora,
            "Descricao_Linha": terminSaba.Descricao_Linha,
            "Desc_Terminal": terminSaba.Desc_Terminal,
            "Dt_Inicio": terminSaba.Dt_Inicio
          });
        }

        if (terminDomi) {
          setShowTerminalDomingo(true);
          setSaidaTerminal(terminDomi.Desc_Terminal);
          setTerminHoraDomingo({
            "Descricao_Hora": terminDomi.Descricao_Hora,
            "Descricao_Linha": terminDomi.Descricao_Linha,
            "Desc_Terminal": terminDomi.Desc_Terminal,
            "Dt_Inicio": terminDomi.Dt_Inicio
          }); 
        }

        if (terminAtip) {
          setShowTerminalAtipico(true);
          setSaidaTerminal(terminAtip.Desc_Terminal);
          setTerminHoraAtipico({
            "Descricao_Hora": terminAtip.Descricao_Hora,
            "Descricao_Linha": terminAtip.Descricao_Linha,
            "Desc_Terminal": terminAtip.Desc_Terminal,
            "Dt_Inicio": terminAtip.Dt_Inicio
          }); 
        }

        loadHorarioObs();
      })
      .catch((error) => {      
        Alert.alert("Erro", "Erro ao carregar horários");          
      })
      .finally(() => {
        setLoading(false);
      });
    };

    async function loadItineratios() {
      setItinerario({});
      setItinerariosId([]);
      setItinerariosVo([]);

      setLoading(true);

      await NetInfo.fetch().then(state => {
        if (!state.isConnected) {
          Alert.alert("Erro", "Conexão de rede indisponível");
          return;
        }

        setLoading(true);

        Api.get(`/BuscaItinerarios/${linha.Linha}`)
        .then((resp) => {
          
          let idaList    = resp.data.filter(function(e) { return e.Sentido === "I" });
          let voltaList  = resp.data.filter(function(e) { return e.Sentido === "V" });
          let itinerario = idaList[0];

          setItinerario({ Linha: itinerario.Linha, Descricao: itinerario.Descricao_Linha });
          setItinerariosId(idaList);
          setItinerariosVo(voltaList);
        })
        .catch((error) => {      
          Alert.alert("Erro", "Erro ao carregar itinerários");          
        })
        .finally(() => {
          setLoading(false);
        });     
      }); 
    };

    function loadHorarioObs() {
      setLoading(true);
      
      Api.get(`/BuscaHorarioObse/${linha.Linha}`)
      .then((resp) => {   
        setObservacoes(resp.data);
      })
      .catch((error) => {      
        Alert.alert("Erro", "Erro ao carregar observações");          
      })
      .finally(() => {
        setLoading(false);
      });      
    };

    function nextHourU(list) {
      const day = new Date().getDay();

      // Só executa se for dia útil
      if (day === 0 || day === 6) {
        return list;
      } else {
        return nextHour(list);
      }  
    };

    function nextHourS(list) {
      const day = new Date().getDay();

      // Só executa se for fim de semana
      if (day !== 0 && day !== 6) {
        return list;
      } else {
        return nextHour(list);
      }     
    };  
    
    function nextHour(list) {     
      let date1 = new Date();
      let found = false; 

      list.forEach(function(e) {
        e.Marcado = false;

        if (!found) {
          let parts = e.Hora_Saida.split(':');	
          let hor  = parts[0];
          let min  = parts[1];

          let date2 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), hor, min);

          if (date2 > date1) {
            found     = true;
            e.Marcado = true;            
          }
        }
      });

      return list;
    };      

    return(
      <ScrollView style={styles.scroll}>
          <View style={styles.container}>
            <Image 
                source={require('../assets/img/logo.png')}
                style={styles.logo}/>

            <View style={styles.title}>
                <Text style={styles.titleText} numberOfLines={2}>Horários dos ônibus que circulam na Grande Vitória - Transcol e Seletivo</Text>
            </View>

            <Picker
              style={styles.picker}
              selectedValue={opcao}
              onValueChange={
                (itemValue, itemIndex) => {
                    setOpcao(itemValue);
                }
            }>
              { 
                  opcoes.map((item, index) => {
                      return (<Picker.Item label={item.Descricao} value={item} key={item.Id}/>) 
                  })
              }
            </Picker>
            
            <Picker 
                style={styles.picker}
                selectedValue={linha}                    
                onValueChange={
                    (itemValue, itemIndex) => {
                        setLinha(itemValue);
                    }
                }>                          
                  { 
                      linhas.map((item, index) => {
                          if (index === 0) {
                            return (<Picker.Item label={item.Descricao} value={item} key={item.Linha}/>) 
                          } else {
                            return (<Picker.Item label={item.Linha + " - " + item.Descricao} value={item} key={item.Linha}/>) 
                          }        
                      })
                  }
            </Picker>

            <TouchableOpacity
              style={styles.button}
              onPress={ () => { search() }}>
              <Text style={styles.buttonText}>Exibir</Text>  
            </TouchableOpacity>

            { loading &&        
              <View style={styles.container}>
                <ActivityIndicator
                  size="large"
                  color="#c1636f"/>
                <Text style={styles.textLoading}>Aguarde...</Text>
              </View>
            }

            { !loading && opcao.Id === 2 && itinerario.Linha &&
              <View style={styles.result}>
                <View style={styles.containerSaida}>
                  <Text style={styles.textSaida}>{itinerario.Linha + " - " + itinerario.Descricao}</Text> 
                </View>

                <View style={styles.containerDia}>  
                  <Text style={styles.textItHeader}>IDA</Text> 
                </View>

                <FlatList
                  contentContainerStyle={styles.listIt}
                  data={itinerariosId}
                  keyExtractor={item => item.Sequencia.toString()}
                  renderItem={({ item }) => {
                      return (                               
                        <View style={styles.containerIt}>
                          <Text style={styles.textIt}>{item.Desc_Via}</Text>
              
                        </View>
                      ); 
                  }}
                /> 

                <View style={styles.containerDia}>  
                  <Text style={styles.textItHeader}>VOLTA</Text> 
                </View>

                <FlatList
                  contentContainerStyle={styles.listIt}
                  data={itinerariosVo}
                  keyExtractor={item => item.Sequencia.toString()}
                  renderItem={({ item }) => {
                      return (                               
                        <View style={styles.containerIt}>
                          <Text style={styles.textIt}>{item.Desc_Via}</Text>
                          <View style={styles.lineIt}/>   
                        </View>
                      ); 
                  }}
                />                                
              </View>
            }

            { !loading && opcao.Id === 1 && (showBairro  || showBairroSabado || showBairroDomingo || showBairroAtipico) && 
              <View style={styles.result}>
                <View style={styles.containerSaida}>
                  <Text style={styles.textSaida}>{"SAÍDA: " + saidaBairro}</Text> 
                </View>

                { showBairro &&
                  <View>
                    <View style={styles.containerDia}>  
                      <Text style={styles.textDia}>{"Dias Úteis - Início: " + bairroHoraDiaUtil.Dt_Inicio}</Text> 
                    </View>
                    
                    <FlatList
                      contentContainerStyle={styles.list}
                      numColumns={5}
                      data={bairroU}
                      keyExtractor={item => item.Hora_Saida}
                      renderItem={({ item }) => {
                        if (item.Marcado === true) {
                          return (                               
                            <TouchableOpacity style={styles.buttonHoraSel}>
                              <Text style={styles.textHoraSel}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        } else { 
                          return (                               
                            <TouchableOpacity style={styles.buttonHora}>
                              <Text style={styles.textHora}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        }  
                      }}
                    />
                  </View>
                } 
                { showBairroSabado && 
                  <View>
                    <View style={styles.containerDia}>  
                      <Text style={styles.textDia}>{"Sábados - Início: " + bairroHoraSabado.Dt_Inicio}</Text> 
                    </View>

                    <FlatList
                      contentContainerStyle={styles.list}
                      numColumns={5}
                      data={bairroS}
                      keyExtractor={item => item.Hora_Saida}
                      renderItem={({ item }) => {
                        if (item.Marcado === true) {
                          return (                               
                            <TouchableOpacity style={styles.buttonHoraSel}>
                              <Text style={styles.textHoraSel}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        } else { 
                          return (                               
                            <TouchableOpacity style={styles.buttonHora}>
                              <Text style={styles.textHora}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        }
                      }}
                    />
                  </View>
                }
                { showBairroDomingo &&
                  <View>
                    <View style={styles.containerDia}>  
                      <Text style={styles.textDia}>{"Domingos/Feriados - Início: " + bairroHoraDomingo.Dt_Inicio}</Text> 
                    </View>
                    <FlatList
                      contentContainerStyle={styles.list}
                      numColumns={5}
                      data={bairroD}
                      keyExtractor={item => item.Hora_Saida}
                      renderItem={({ item }) => {
                        if (item.Marcado === true) {
                          return (                               
                            <TouchableOpacity style={styles.buttonHoraSel}>
                              <Text style={styles.textHoraSel}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        } else { 
                          return (                               
                            <TouchableOpacity style={styles.buttonHora}>
                              <Text style={styles.textHora}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        }
                      }}
                    />
                  </View>
                }
                { showBairroAtipico &&
                  <View>
                    <View style={styles.containerDia}>  
                      <Text style={styles.textDia}>{"Dias Atípicos - Início: " + bairroHoraAtipico.Dt_Inicio}</Text> 
                    </View>
                    <FlatList
                      contentContainerStyle={styles.list}
                      numColumns={5}
                      data={bairroA}
                      keyExtractor={item => item.Hora_Saida}
                      renderItem={({ item }) => {
                        if (item.Marcado === true) {
                          return (                               
                            <TouchableOpacity style={styles.buttonHoraSel}>
                              <Text style={styles.textHoraSel}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        } else { 
                          return (                               
                            <TouchableOpacity style={styles.buttonHora}>
                              <Text style={styles.textHora}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        }
                      }}
                    />
                  </View>
                }
              </View>
            }
            { !loading && opcao.Id === 1 && (showTerminal || showTerminalSabado || showTerminalDomingo || showTerminalAtipico) &&
              <View style={styles.result}>
                <View style={styles.containerSaida}>
                  <Text style={styles.textSaida}>{"SAÍDA: " + saidaTerminal}</Text> 
                </View>

                { showTerminal && 
                  <View>
                    <View style={styles.containerDia}>  
                      <Text style={styles.textDia}>{"Dias Úteis - Início: " + terminHoraDiaUtil.Dt_Inicio}</Text> 
                    </View>
                    <FlatList
                      contentContainerStyle={styles.list}
                      numColumns={5}
                      data={terminU}
                      keyExtractor={item => item.Hora_Saida}
                      renderItem={({ item }) => {
                        if (item.Marcado === true) {
                          return (                               
                            <TouchableOpacity style={styles.buttonHoraSel}>
                              <Text style={styles.textHoraSel}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        } else { 
                          return (                               
                            <TouchableOpacity style={styles.buttonHora}>
                              <Text style={styles.textHora}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        }
                      }}
                    />
                  </View>
                }  
                { showTerminalSabado &&
                  <View>
                    <View style={styles.containerDia}>  
                      <Text style={styles.textDia}>{"Sábados - Início: " + terminHoraSabado.Dt_Inicio}</Text> 
                    </View>
                    <FlatList
                      contentContainerStyle={styles.list}
                      numColumns={5}
                      data={terminS}
                      keyExtractor={item => item.Hora_Saida}
                      renderItem={({ item }) => {
                        if (item.Marcado === true) {
                          return (                               
                            <TouchableOpacity style={styles.buttonHoraSel}>
                              <Text style={styles.textHoraSel}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        } else { 
                          return (                               
                            <TouchableOpacity style={styles.buttonHora}>
                              <Text style={styles.textHora}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        }
                      }}
                    />
                  </View>  
                }
                { showTerminalDomingo &&
                  <View>
                    <View style={styles.containerDia}>  
                      <Text style={styles.textDia}>{"Domingos/Feriados - Início: " + terminHoraDomingo.Dt_Inicio}</Text> 
                    </View>
                    <FlatList
                      contentContainerStyle={styles.list}
                      numColumns={5}
                      data={terminD}
                      keyExtractor={item => item.Hora_Saida}
                      renderItem={({ item }) => {
                        if (item.Marcado === true) {
                          return (                               
                            <TouchableOpacity style={styles.buttonHoraSel}>
                              <Text style={styles.textHoraSel}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        } else { 
                          return (                               
                            <TouchableOpacity style={styles.buttonHora}>
                              <Text style={styles.textHora}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        }
                      }}
                    />
                  </View>
                }
                { showTerminalAtipico &&
                  <View>
                    <View style={styles.containerDia}>  
                      <Text style={styles.textDia}>{"Dias Atípicos - Início: " + terminHoraAtipico.Dt_Inicio}</Text> 
                    </View>
                    <FlatList
                      contentContainerStyle={styles.list}
                      numColumns={5}
                      data={terminA}
                      keyExtractor={item => item.Hora_Saida}
                      renderItem={({ item }) => {
                        if (item.Marcado === true) {
                          return (                               
                            <TouchableOpacity style={styles.buttonHoraSel}>
                              <Text style={styles.textHoraSel}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        } else { 
                          return (                               
                            <TouchableOpacity style={styles.buttonHora}>
                              <Text style={styles.textHora}>{item.Hora_Saida + item.Tipo_Orientacao}</Text>
                            </TouchableOpacity>             
                          );
                        }
                      }}
                    />
                  </View>
                }                 
              </View>
            }
            { !loading && opcao.Id === 1 && observacoes.length > 0 &&
              <FlatList
                contentContainerStyle={styles.listObs}
                data={observacoes}
                keyExtractor={(item) => item.Tipo_Orientacao}
                renderItem={({ item }) => {
                  return(
                    <View style={styles.containerObs}>
                      <Text style={styles.textObs}>{item.Tipo_Orientacao + " - " + item.Descricao_Orientacao}</Text>
                    </View> 
                  );  
                }}
              />
            }          
          </View>         
      </ScrollView> 
    );
}