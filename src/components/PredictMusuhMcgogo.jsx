import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import SessionManager from "./SessionManager";
import TokenInputModal from "./TokenInputModal";
import LockedFeatureOverlay from "./LockedFeatureOverlay";

// Import semua komponen (sesuaikan path berdasarkan lokasi file)
import EnhancedBackground from "./EnhancedBackground";
import Animations from "../styles/Animations";
import HudElements from "./HudElements";
import Header from "./Header";
import ActionButtons from "./ActionButtons";
import InstructionsSection from "./InstructionSection";
import UserInputSection from "./UserInputSection";
import AdvancedMode from "./AdvancedMode";
import RoundsTable from "./RoundsTable";
import InfoAlerts from "./InfoAlerts";
import Footer from "./Footer";
import CyberNotification from "./CybeNotification";

// Import logic dan data
import {
  computeBasicPredictions,
  computeAdvancedPredictions,
} from "../utils/predictionLogic";
import { advancedScenarios } from "../data/advancedScenarios";
import {
  canGenerateGuestToken,
  generateGuestToken,
  formatCooldownTime,
  cleanExpiredGuestCooldowns,
} from "../utils/authUtils";

const PredictMusuhMcgogo = () => {
  const { user, hasPermission, currentToken, isAuthenticated, login } =
    useAuth();
  const actionButtonsRef = useRef(null);

  // Guest token states
  const [isGeneratingGuest, setIsGeneratingGuest] = useState(false);
  const [guestCooldownInfo, setGuestCooldownInfo] = useState({
    canGenerate: true,
    timeLeft: 0,
  });

  // State management
  const [userName, setUserName] = useState("");
  const [p8Name, setP8Name] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [rounds, setRounds] = useState([
    { round: 1, userVs: "", p8Vs: "" },
    { round: 2, userVs: "", p8Vs: "" },
    { round: 3, userVs: "", p8Vs: "" },
    { round: 4, userVs: "", p8Vs: "" },
    { round: 5, userVs: "", p8Vs: "" },
    { round: 6, userVs: "", p8Vs: "" },
    { round: 7, userVs: "", p8Vs: "" },
  ]);

  // Load animasi saat komponen mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Check guest cooldown saat mount
  useEffect(() => {
    if (!isAuthenticated) {
      checkGuestCooldown();
      cleanExpiredGuestCooldowns();
    }
  }, [isAuthenticated]);

  // Timer untuk guest cooldown countdown
  useEffect(() => {
    let timer;
    if (
      !isAuthenticated &&
      !guestCooldownInfo.canGenerate &&
      guestCooldownInfo.timeLeft > 0
    ) {
      timer = setInterval(() => {
        checkGuestCooldown();
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [guestCooldownInfo, isAuthenticated]);

  // Update rounds setiap kali ada perubahan - hanya jika authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const basicRounds = computeBasicPredictions(rounds, userName, p8Name);
      setRounds(basicRounds);
    }
  }, [userName, p8Name, isAuthenticated]);

  // Show welcome notification for first-time users
  useEffect(() => {
    if (!isAuthenticated && !showTokenInput) {
      const timer = setTimeout(() => {
        setNotification({
          message:
            "Selamat datang! Masukkan token untuk mengakses fitur prediksi.",
          type: "info",
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, showTokenInput]);

  // Notification handler dengan info user
  const showNotification = (message, type = "info") => {
    const prefix = user?.name ? `[${user.name}]` : "[GUEST]";
    setNotification({
      message: `${prefix} ${message}`,
      type,
    });
  };

  const checkGuestCooldown = () => {
    const cooldownInfo = canGenerateGuestToken();
    setGuestCooldownInfo(cooldownInfo);
  };

  const handleGuestGenerate = () => {
    // Trigger guest generation dari ActionButtons
    if (
      actionButtonsRef.current &&
      actionButtonsRef.current.handleGenerateGuestToken
    ) {
      actionButtonsRef.current.handleGenerateGuestToken();
    }
  };

  // Event handlers - dengan authentication check
  const handleUserNameChange = (e) => {
    if (!isAuthenticated) {
      showNotification("BUTUH TOKEN UNTUK MENGGUNAKAN FITUR INI", "warning");
      setShowTokenInput(true);
      return;
    }

    setUserName(e.target.value);
    if (e.target.value.trim()) {
      showNotification("USER NICKNAME LOCKED", "info");
    }
  };

  const handleP8NameChange = (e) => {
    if (!isAuthenticated) {
      showNotification("BUTUH TOKEN UNTUK MENGGUNAKAN FITUR INI", "warning");
      setShowTokenInput(true);
      return;
    }

    setP8Name(e.target.value);
    if (e.target.value.trim()) {
      showNotification("MUSUH PERTAMA LOCKED", "success");
    }
  };

  const handleRoundChange = (index, field, value) => {
    if (!isAuthenticated) {
      showNotification("BUTUH TOKEN UNTUK MENGGUNAKAN FITUR INI", "warning");
      setShowTokenInput(true);
      return;
    }

    const newRounds = [...rounds];
    newRounds[index][field] = value;
    setRounds(newRounds);

    // Recompute predictions
    setTimeout(() => {
      const basicRounds = computeBasicPredictions(newRounds, userName, p8Name);
      setRounds(basicRounds);
    }, 50);

    showNotification(`ROUND ${index + 1} UPDATED`, "info");
  };

  const handleReset = () => {
    if (!isAuthenticated) {
      showNotification("BUTUH TOKEN UNTUK MENGGUNAKAN FITUR INI", "warning");
      setShowTokenInput(true);
      return;
    }

    if (
      confirm(
        "⚠️ KONFIRMASI RESET SISTEM ⚠️\n\nSemua data akan dihapus. Lanjutkan operasi reset?"
      )
    ) {
      setUserName("");
      setP8Name("");
      setShowInstructions(false);
      setShowAdvanced(false);
      setSelectedScenario("");
      setRounds([
        { round: 1, userVs: "", p8Vs: "" },
        { round: 2, userVs: "", p8Vs: "" },
        { round: 3, userVs: "", p8Vs: "" },
        { round: 4, userVs: "", p8Vs: "" },
        { round: 5, userVs: "", p8Vs: "" },
        { round: 6, userVs: "", p8Vs: "" },
        { round: 7, userVs: "", p8Vs: "" },
      ]);
      showNotification("SISTEM BERHASIL DIRESET", "warning");
    }
  };

  const handleAdvancedMode = () => {
    if (!isAuthenticated) {
      showNotification("BUTUH TOKEN UNTUK MENGGUNAKAN FITUR INI", "warning");
      setShowTokenInput(true);
      return;
    }

    // Check permission untuk advanced mode
    if (!hasPermission("advanced")) {
      showNotification("AKSES DITOLAK - BUTUH TOKEN ADVANCED", "warning");
      setShowTokenInput(true);
      return;
    }

    if (!showAdvanced && (!userName.trim() || !p8Name.trim())) {
      showNotification("LENGKAPI DATA DASAR TERLEBIH DAHULU", "warning");
      return;
    }
    setShowAdvanced(!showAdvanced);
    if (!showAdvanced) {
      showNotification("MODE ADVANCED DIAKTIFKAN", "success");
    }
  };

  const handleScenarioChange = (scenario) => {
    if (!isAuthenticated) {
      showNotification("BUTUH TOKEN UNTUK MENGGUNAKAN FITUR INI", "warning");
      setShowTokenInput(true);
      return;
    }

    setSelectedScenario(scenario);
    showNotification(
      `SKENARIO ${advancedScenarios[scenario].name.toUpperCase()} DIPILIH`,
      "info"
    );
  };

  const handleTokenInputRequest = () => {
    setShowTokenInput(true);
  };

  // Gabungkan rounds dasar dengan advanced
  const allRounds =
    showAdvanced && selectedScenario
      ? [...rounds, ...computeAdvancedPredictions(rounds, selectedScenario)]
      : rounds;

  return (
    <div className="min-h-screen bg-animated-gradient relative overflow-hidden">
      {/* Session Manager - hanya muncul jika authenticated */}
      {isAuthenticated && <SessionManager />}

      {/* Import CSS Animations */}
      <Animations />

      {/* Enhanced Background Effects */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-cyan-900/20 to-pink-900/25 animate-pulse"
        style={{ animationDuration: "6s" }}
      ></div>
      <div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/5 to-transparent animate-pulse"
        style={{ animationDuration: "8s", animationDelay: "2s" }}
      ></div>
      <div
        className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"
        style={{ animationDuration: "10s", animationDelay: "4s" }}
      ></div>

      {/* Enhanced Background with all effects */}
      <EnhancedBackground />

      {/* Scan lines effects - symmetrical */}
      <div
        className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none z-10"
        style={{ animation: "shimmer 3s ease-in-out infinite" }}
      ></div>
      <div
        className="fixed bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent pointer-events-none z-10"
        style={{
          animation: "shimmer 4s ease-in-out infinite",
          animationDelay: "1s",
        }}
      ></div>

      {/* HUD Elements */}
      <HudElements />

      {/* Status Indicators - Symmetrical Top Corners */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-black/60 backdrop-blur-md border border-cyan-400/30 rounded-lg p-2 text-xs">
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <div
                  className={`w-2 h-2 rounded-full ${
                    user?.level === "admin"
                      ? "bg-red-400"
                      : user?.level === "developer"
                      ? "bg-purple-400"
                      : user?.level === "premium"
                      ? "bg-yellow-400"
                      : "bg-green-400"
                  } animate-pulse`}
                ></div>
                <span className="text-cyan-300">
                  {user?.level?.toUpperCase()}
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <span className="text-gray-400">GUEST MODE</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Symmetrical right corner - Token reminder dengan guest generation */}
      {!isAuthenticated && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-400/30 rounded-lg p-3 text-xs max-w-xs">
            <div className="flex items-center space-x-2 mb-2">
              <i className="fas fa-key text-yellow-400"></i>
              <span className="text-yellow-300 font-bold">TOKEN REQUIRED</span>
            </div>
            <p className="text-yellow-300/80 text-xs mb-3">
              Unlock semua fitur prediksi
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleTokenInputRequest}
                className="flex-1 bg-yellow-500/30 text-yellow-200 px-2 py-1 rounded text-xs hover:bg-yellow-500/40 transition-all"
              >
                <i className="fas fa-key mr-1"></i>
                INPUT
              </button>

              {/* Generate Guest Button dari ActionButtons logic */}
              {guestCooldownInfo.canGenerate ? (
                <button
                  onClick={handleGuestGenerate}
                  disabled={isGeneratingGuest}
                  className="flex-1 bg-purple-500/30 text-purple-200 px-2 py-1 rounded text-xs hover:bg-purple-500/40 transition-all disabled:opacity-50"
                >
                  {isGeneratingGuest ? (
                    <>
                      <i className="fas fa-cog animate-spin mr-1"></i>
                      GENERATING...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic mr-1"></i>
                      GUEST
                    </>
                  )}
                </button>
              ) : (
                <div className="flex-1 bg-red-500/20 border border-red-400/30 rounded text-xs py-1 px-2">
                  <div className="text-red-400 font-bold text-center">
                    <i className="fas fa-clock mr-1"></i>
                    {formatCooldownTime(guestCooldownInfo.timeLeft)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <CyberNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div
        className={`container mx-auto px-2 md:px-4 py-4 md:py-8 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 relative shadow-2xl shadow-cyan-400/10 transform transition-all duration-500 hover:shadow-cyan-400/20 hover:shadow-3xl">
          {/* Rainbow Border dengan animasi */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-t-2xl md:rounded-t-3xl animate-shimmer"></div>

          {/* Security Badge */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/30 rounded-lg px-3 py-1 text-xs">
            <span className="text-green-400">
              {isAuthenticated ? "🔓 AUTHENTICATED" : "🔒 GUEST MODE"}
            </span>
          </div>

          {/* Header */}
          <Header />

          {/* Action Buttons */}
          <ActionButtons
            ref={actionButtonsRef}
            showInstructions={showInstructions}
            showAdvanced={showAdvanced}
            onToggleInstructions={() => setShowInstructions(!showInstructions)}
            onToggleAdvanced={handleAdvancedMode}
            onReset={handleReset}
            onTokenInput={handleTokenInputRequest}
            hasAdvancedPermission={hasPermission("advanced")}
            isAuthenticated={isAuthenticated}
          />

          {/* Instructions - selalu bisa dilihat */}
          <InstructionsSection showInstructions={showInstructions} />

          {/* User Input Section - TANPA overlay, hanya disabled styling */}
          <UserInputSection
            userName={userName}
            p8Name={p8Name}
            onUserNameChange={handleUserNameChange}
            onP8NameChange={handleP8NameChange}
            disabled={!isAuthenticated}
          />

          {/* Advanced Mode Controls - dengan lock overlay (tetap ada) */}
          {showAdvanced && (
            <div className="relative mb-6">
              {hasPermission("advanced") && isAuthenticated ? (
                <AdvancedMode
                  showAdvanced={showAdvanced}
                  selectedScenario={selectedScenario}
                  onScenarioChange={handleScenarioChange}
                />
              ) : (
                <LockedFeatureOverlay
                  isVisible={true}
                  featureName="Mode Advanced"
                  requiredPermission="advanced"
                  onTokenInputClick={handleTokenInputRequest}
                />
              )}
            </div>
          )}

          {/* Rounds Table - dengan lock overlay (tetap ada) */}
          <div className="relative">
            <RoundsTable
              allRounds={allRounds}
              userName={userName || "Guest"}
              p8Name={p8Name || "Unknown"}
              showAdvanced={
                showAdvanced && hasPermission("advanced") && isAuthenticated
              }
              onRoundChange={handleRoundChange}
              disabled={!isAuthenticated}
            />
            {!isAuthenticated && (
              <LockedFeatureOverlay
                isVisible={true}
                featureName="Tabel Prediksi"
                requiredPermission="basic"
                onTokenInputClick={handleTokenInputRequest}
              />
            )}
          </div>

          {/* Info Alerts - hanya muncul jika authenticated */}
          {isAuthenticated && (
            <InfoAlerts
              showAdvanced={showAdvanced && hasPermission("advanced")}
              selectedScenario={selectedScenario}
            />
          )}

          {/* Footer dengan user info */}
          <Footer userInfo={user} />
        </div>
      </div>

      {/* Token Input Modal */}
      <TokenInputModal
        isOpen={showTokenInput}
        onClose={() => setShowTokenInput(false)}
      />
    </div>
  );
};

export default PredictMusuhMcgogo;
