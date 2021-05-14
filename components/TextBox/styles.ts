import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'white',
        
    },

    mainBox: {
        flexDirection: 'row',
        padding: 10,
        marginRight: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        
    },

    textInput: {
        flex: 1,
        marginHorizontal: 10,
        fontSize: 18,
        paddingBottom: 4,
    },

    btn: {
        marginRight: 5,
        marginHorizontal: 10,
        
        
    },

    icon: {
        paddingBottom: 4,
        marginHorizontal: 10,
    },
    smile: {
        paddingBottom: 4,
    }
})

export default styles;