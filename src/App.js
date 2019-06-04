import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import ImageMarker from "react-native-image-marker"
import ImagePicker from 'react-native-image-picker';
import Share from 'react-native-share';

const GOOD_MORNING = [
        require("./assets/images/bomdia_ovo.png"),
        require("./assets/images/bom-dia-sun.png"),
        require("./assets/images/BomDia.png") 
      ];

export default class App extends Component {

  state = {
    avatarSource: "",
    message: "COMECE AQUI",
    uri: null
  }
  openImagePicker = () => {

    ImagePicker.showImagePicker( {mediaType: "photo",
        title: "Selecione sua foto",
        chooseFromLibraryButtonTitle: "Escolha uma da sua galeria!",
        takePhotoButtonTitle: "Tire uma foto agora!",
        cancelButtonTitle: "Desistir"
    }, async (response) => {
      if(response.didCancel) {
        this.setState({message: "COMECE AQUI"});
        return;
      }
      this.setState({avatarSource: "data:image/png;base64," + response.data});
      const randomPicture = Math.floor(Math.random() * GOOD_MORNING.length);
      ImageMarker.markImage({
        src: { uri: "data:image/jpeg;base64," + response.data, isStatic: true}, 
        markerSrc: GOOD_MORNING[randomPicture], // icon uri
        position: "bottomCenter",
        scale: 1, // scale of bg
        markerScale: 1.5, // scale of icon
        quality: 100 // quality of image
      }).then(path => {
        this.setState({
          uri: Platform.OS === 'android' ? 'file://' + path : path
        })
      });
    });

    this.setState({message: "CARREGANDO..."});
  }

  cleanUri = () => {
    this.setState({uri: null, message: "COMECE AQUI"});
  }

  render() {

    let shareImageBase64 = {
      title: "Bom dia grupo",
      message: "",
      url: this.state.uri,
      social: Share.Social.WHATSAPP
    };

    return (
      <View style={styles.container}>
        {this.state.uri ? 
        <>
          <TouchableOpacity onPress={this.cleanUri} style={styles.getBack}>
            <Image style={styles.zapImg} source={require("./assets/icons/undo-icon.png")} />
          </TouchableOpacity>
          <Image style={styles.resultImg} source={{uri: this.state.uri}} />
            <TouchableOpacity
                style={styles.shareButton}
              onPress={async ()=>{
                try {
                  await Share.shareSingle(shareImageBase64)
                } catch(error) {
                  console.log(error);
                }
              }}>
              <Text style={styles.shareText}>COMPARTILHE </Text>
              <Image style={styles.zapImg} source={require("./assets/icons/whatsapp-icon.png")} />
            </TouchableOpacity>
        </>
        : 
        <TouchableOpacity style={{width:"100%", height: "100%", justifyContent: "center",  alignItems: 'center'}} onPress={this.openImagePicker}>
          <Image style={styles.cameraImg} source={require("./assets/icons/camera-icon.png")} />
          <Text style={styles.welcome}>{this.state.message}</Text>
        </TouchableOpacity>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#04647D',
    color: '#fff',
  },
  shareButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4F93A6',
    width: "75%"
  },
  shareText: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    color: "#fff",
    fontFamily: 'basictitlefont'
  },
  cameraImg: {
    height: 70,
    width: 70
  },
  zapImg: {
    height: 20,
    width: 20
  },
  welcome: {
    fontSize: 35,
    textAlign: 'center',
    margin: 10,
    color: "#fff",
    fontFamily: 'basictitlefont'
  },
  resultImg: {
    width: '75%',
    height:'80%',
    resizeMode:'cover',
    borderColor: 'rgba(255, 255, 255, .5)',
    borderWidth: 3,
    marginBottom: 20
  },
  getBack: {
    top: -5,
    left: "-43%",
    backgroundColor: '#4F93A6',
    borderRadius: 15,
    padding: 6
  }
});
