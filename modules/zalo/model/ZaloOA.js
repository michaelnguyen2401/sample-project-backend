class ZaloOA {
  constructor(id) {
    this.data = {
      id,
      oaId: null,
      appId: null,
      oaAccessToken: null,
      oaAccessTokenLastUpdatedTime: null,
      oaInfo: {},
    };
  }

  get id() {
    return this.data.id;
  }

  get oaId() {
    return this.oaId.id;
  }

  set oaId(value) {
    this.data.oaId = value;
  }

  get appId() {
    return this.data.appId;
  }

  set appId(value) {
    this.data.appId = value;
  }

  get oaAccessToken() {
    return this.data.oaAccessToken;
  }

  set oaAccessToken(value) {
    this.data.oaAccessToken = value;
  }

  get oaAccessTokenLastUpdatedTime() {
    return this.data.oaAccessTokenLastUpdatedTime;
  }

  set oaAccessTokenLastUpdatedTime(value) {
    this.data.oaAccessTokenLastUpdatedTime = value;
  }

  get oaInfo() {
    return this.data.oaInfo;
  }

  set oaInfo(value) {
    this.data.oaInfo = value;
  }
}

module.exports = ZaloOA;