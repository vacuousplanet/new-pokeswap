-- lua client for pokeswap

local state = "idle"

local BADGE_FLAGS_START = 0x10C
local BADGE_MASK = 0x7F80

local ACTIVE_TEAM = 0x020244E8

-- declare gym status
local gym_status = 0

function CHECK_SERVER ()

    if not comm.socketServerIsConnected() then
        print('socket server is not connected')
        return "no connection"
    end

    local responce = comm.socketServerResponse()

    return responce
end

-- TODO: create look up table of responce id's
--       establish protocol to separate id from content (e.g ID : CONTENT)

while true do
    emu.frameadvance()
    local responce = CHECK_SERVER()

    if responce == "no connection" then
        console.log("connection lost, exiting script loop")
        break
    end

    if responce ~= "" and responce ~= nil then
        console.log(responce)
    end
end