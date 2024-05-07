export default {
  methods: {
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
      }
      return array
    },
    cleanObject(response, state) {
      if (response == null && response.length <= 0) return
      // console.log("cleanObject", state, response.data);

      let cleanedobj = []
      let obj = {
        url: '1.jpg',
        lg: '1.jpg',
        md: '1.jpg',
        sm: '1.jpg',
        thumb: '1.jpg',
        caption: 'Caption',
        text: 'Text'
      }
      let parseresponse = JSON.parse(JSON.stringify(response.data))

      for (let i = 0; i < parseresponse.images.length; i++) {
        obj.url = process.env.BASE_URL + '/' + parseresponse.images[i].lg
        obj.thumb = process.env.BASE_URL + '/' + parseresponse.images[i].thumb
        obj.lg = process.env.BASE_URL + '/' + parseresponse.images[i].lg
        obj.md = process.env.BASE_URL + '/' + parseresponse.images[i].md
        obj.sm = process.env.BASE_URL + '/' + parseresponse.images[i].sm

        cleanedobj.push(JSON.parse(JSON.stringify(obj)))
      }

      return {
        type: parseresponse.type,
        state: state,
        images: cleanedobj
      }
    }
  }
}
