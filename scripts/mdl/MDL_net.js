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
    if(thisFun.headers.includes(header)) ERROR_HANDLER.headerConfict(header, "packet");
    if(mode == null) mode = "client";
    if(!mode.equalsAny(thisFun.modes)) return;
    if(payloadCaller == null) payloadCaller = Function.air;

    if(mode === "client" || mode === "both") Vars.netClient.addPacketHandler(header, payloadCaller);
    if(mode === "server" || mode === "both") Vars.netServer.addPacketHandler(header, payloadCaller);

    thisFun.headers.push(header);
  }
  .setProp({
    modes: ["client", "server", "both"],
    headers: [],
  });
  exports.__packetHandler = __packetHandler;


  /* ----------------------------------------
   * NOTE:
   *
   * Sends out a packet.
   * ---------------------------------------- */
  const sendPacket = function(mode, header, payload, isReliable, useConnection) {
    const thisFun = sendPacket;

    if(!global.lovec.param.modded || header == null || payload == null) return;
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
    modes: ["client", "server", "both"],
  });
  exports.sendPacket = sendPacket;
