import moment from "moment"
import ConnectCompReducer from "../../../utils/connectPageReducer"
// import { awaitWrapper } from "../../../utils"
import connectArtistDetailsReducer from "../ArtistDetails/connectArtistDetailsReducer"

class ConnectArtistMediaDetails extends ConnectCompReducer {
  requestBigAlbums = url => {
    return connectArtistDetailsReducer.requestArtistAlbums(url)
  }

  requestBigMVs = async url => {
    const res = await this.fetcher.get(url)
    return [
      res.data.mvs.map(mv => ({
        imgUrl: mv.imgurl,
        title: mv.name,
        id: mv.id,
        duration: mv.duration
          ? moment(new Date(mv.duration), "HH:mm").format("HH:mm")
          : "",
        type: "biggerMV",
      })),
      res.data.hasMore,
    ]
  }

  getInitialData = async () => {}
}

export default new ConnectArtistMediaDetails()
