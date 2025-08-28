/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- packet ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a new packet handler.
   * ---------------------------------------- */
  const __packetHandler = function(mode, header, payloadCaller) {
    const thisFun = __packetHandler;

    if(header == null) return;
    if(thisFun.headers.includes(header)) throw new Error("A header name conflicts with existing headers: " + header);

    if(mode == null) mode = "client";
    if(!mode.equalsAny(thisFun.modes)) return;

    if(payloadCaller == null) payloadCaller = Function.air;

    if(mode === "client" || mode === "both") Vars.netClient.addPacketHandler(header, payloadCaller);
    if(mode === "server" || mode === "both") Vars.netServer.addPacketHandler(header, payloadCaller);

    thisFun.headers.push(header);
  }
  .setProp({
    "modes": ["client", "server", "both"],
    "headers": [],
  });
  exports.__packetHandler = __packetHandler;


  /* ----------------------------------------
   * NOTE:
   *
   * Sends out a packet.
   * ---------------------------------------- */
  const sendPacket = function(mode, header, payload, isReliable, useConnection) {
    const thisFun = sendPacket;

    if(!global.lovec.modded || header == null || payload == null) return;

    if(mode == null) mode = "server";
    if(!mode.equalsAny(thisFun.modes)) return;

    if(mode === "server" || (mode === "both" && !Vars.net.client())) {
      isReliable ?
        Call.serverPacketReliable(header, payload) :
        Call.serverPacketUnreliable(header, payload);
    } else if(mode === "client" || mode === "both" && Vars.net.client()) {
      isReliable ?
        (useConnection ? Call.clientPacketReliable(Vars.player.con, header, payload) : Call.clientPacketReliable(header, payload)) :
        (useConnection ? Call.clientPacketUnreliable(Vars.player.con, header, payload) : Call.clientPacketUnreliable(header, payload));
    };
  }
  .setProp({
    "modes": ["client", "server", "both"],
  });
  exports.sendPacket = sendPacket;


  /* <---------- http ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Opens an HTTP GET request, result is called as string (empty if errored).
   * ---------------------------------------- */
  const _h_str = function(url, caller) {
    Http.get(url, res => {
      caller(res.getResultAsString());
    }, err => {
      caller("");
    });
  };
  exports._h_str = _h_str;


  /* ----------------------------------------
   * NOTE:
   *
   * Opens an HTTP GET request, result is called as json object.
   * ---------------------------------------- */
  const _h_obj = function(url, caller) {
    Http.get(url, res => {
      caller(JSON.parse(res.getResultAsString()));
    }, err => {
      caller({});
    });
  };
  exports._h_obj = _h_obj;
