import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [initialWeight, setInitialWeight] = useState("");
  const [initialFat, setInitialFat] = useState("");
  const [initialSize, setInitialSize] = useState("");
  const [weight, setWeight] = useState("");
  const [fat, setFat] = useState("");
  const [size, setSize] = useState("");
  const [goalSize, setGoalSize] = useState("38");
  const [points, setPoints] = useState(0);
  const [dailyPoints, setDailyPoints] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userSaved, setUserSaved] = useState(false);

  const [dietOk, setDietOk] = useState(false);
  const [waterOk, setWaterOk] = useState(false);
  const [exerciseOk, setExerciseOk] = useState(false);
  const [massageOk, setMassageOk] = useState(false);
  const [steps, setSteps] = useState(0);
  const [dailyBreakdown, setDailyBreakdown] = useState({});

  const handleSaveUser = () => {
    if (name && age && height && initialWeight && initialFat && initialSize) {
      setInitialWeight(parseFloat(initialWeight));
      setInitialFat(parseFloat(initialFat));
      setInitialSize(parseInt(initialSize));
      setWeight(parseFloat(initialWeight));
      setFat(parseFloat(initialFat));
      setSize(parseInt(initialSize));
      setUserSaved(true);
    }
  };

  const handleUpdate = () => {
    let newPoints = 0;
    const breakdown = {};

    const weightDelta = weight - initialWeight;
    const fatDelta = fat - initialFat;
    const sizeDelta = size - initialSize;

    breakdown.weight = weightDelta > 0 ? -1 : weightDelta < 0 ? 5 : 0;
    breakdown.fat = fatDelta > 0 ? -1 : fatDelta < 0 ? 10 : 0;
    breakdown.size = sizeDelta > 0 ? -1 : sizeDelta < 0 ? 20 : 0;
    breakdown.diet = dietOk ? 5 : 0;
    breakdown.exercise = exerciseOk ? 5 : 0;
    breakdown.water = waterOk ? 5 : 0;

    const date = selectedDate.toISOString().split("T")[0];
    newPoints =
      breakdown.weight +
      breakdown.fat +
      breakdown.size +
      breakdown.diet +
      breakdown.exercise +
      breakdown.water;

    setDailyPoints((prev) =>
      prev.filter((entry) => entry.date !== date).concat({ date, points: newPoints })
    );
    setDailyBreakdown(breakdown);
    const updatedTotal =
      dailyPoints.filter((e) => e.date !== date).reduce((acc, cur) => acc + cur.points, 0) +
      newPoints;
    setPoints(updatedTotal);

    setDietOk(false);
    setWaterOk(false);
    setExerciseOk(false);
    setMassageOk(false);
    setSteps(0);
  };

  const getDailyTotal = (date) => {
    return dailyPoints
      .filter((entry) => entry.date === date)
      .reduce((acc, curr) => acc + curr.points, 0);
  };

  const getWeeklyTotal = () => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 6);
    return dailyPoints
      .filter((entry) => new Date(entry.date) >= weekAgo)
      .reduce((acc, curr) => acc + curr.points, 0);
  };

  const calculateBMI = (w) => {
    const hMeters = parseFloat(height) / 100;
    return (parseFloat(w) / (hMeters * hMeters)).toFixed(1);
  };

  const getTargetWeight = () => {
    const hMeters = parseFloat(height) / 100;
    return Math.round(24.9 * hMeters * hMeters);
  };

  const bmiNow = calculateBMI(weight);
  const bmiStart = calculateBMI(initialWeight);
  const targetWeight = getTargetWeight();
  const weightProgress =
    isNaN(weight) || isNaN(initialWeight) || isNaN(targetWeight)
      ? 0
      : Math.min(
          100,
          ((parseFloat(initialWeight) - parseFloat(weight)) /
            (parseFloat(initialWeight) - targetWeight)) *
            100
        );

  const totalDailyPoints = Object.values(dailyBreakdown).reduce(
    (sum, val) => sum + (val || 0),
    0
  );

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Tabs defaultValue="track">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="track">Takip</TabsTrigger>
          <TabsTrigger value="progress">İlerleme</TabsTrigger>
          <TabsTrigger value="breakdown">Puan Detayı</TabsTrigger>
        </TabsList>

        <TabsContent value="track">
          <Card>
            <CardContent className="space-y-4">
              {!userSaved ? (
                <>
                  <Input placeholder="Adın" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input placeholder="Yaş" value={age} onChange={(e) => setAge(e.target.value)} />
                  <Input placeholder="Boy (cm)" value={height} onChange={(e) => setHeight(e.target.value)} />
                  <Input placeholder="Başlangıç Kilo" value={initialWeight} onChange={(e) => setInitialWeight(e.target.value)} />
                  <Input placeholder="Başlangıç Yağ Oranı" value={initialFat} onChange={(e) => setInitialFat(e.target.value)} />
                  <Input placeholder="Başlangıç Beden" value={initialSize} onChange={(e) => setInitialSize(e.target.value)} />
                  <Button onClick={handleSaveUser}>Kaydet ve Başla</Button>
                </>
              ) : (
                <>
                  <Input placeholder="Güncel Kilo" type="number" value={weight} onChange={(e) => setWeight(parseFloat(e.target.value))} />
                  <Input placeholder="Güncel Yağ Oranı" type="number" value={fat} onChange={(e) => setFat(parseFloat(e.target.value))} />
                  <Input placeholder="Güncel Beden" type="number" value={size} onChange={(e) => setSize(parseInt(e.target.value))} />
                  <Calendar onChange={setSelectedDate} value={selectedDate} />
                  <div className="flex flex-wrap gap-2 pt-4">
                    <Button variant={dietOk ? "default" : "outline"} onClick={() => {
                      if (!dietOk) { setPoints(points + 5); setDietOk(true); }
                    }}>🥗 Diyete Uydum</Button>
                    <Button variant={exerciseOk ? "default" : "outline"} onClick={() => {
                      if (!exerciseOk) { setPoints(points + 5); setExerciseOk(true); }
                    }}>💪 Spor Yaptım</Button>
                    <Button variant={waterOk ? "default" : "outline"} onClick={() => {
                      if (!waterOk) { setPoints(points + 5); setWaterOk(true); }
                    }}>💧 Su İçtim</Button>
                  </div>
                  <Button className="mt-4" onClick={handleUpdate}>Güncelle & Puan Kazan</Button>
                  <p className="font-semibold pt-4">Toplam Kazanılan Puan: {points}</p>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardContent className="space-y-4">
              <p><strong>Başlangıç BMI:</strong> {bmiStart}</p>
              <p><strong>Güncel BMI:</strong> {bmiNow}</p>
              <p><strong>Hedef Kilo:</strong> {targetWeight} kg</p>
              <h2 className="text-lg font-bold">Kilo Hedefi İlerlemesi</h2>
              <Progress value={weightProgress} />
              <p>{Math.round(weightProgress)}% tamamlandı</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <Card>
            <CardContent className="space-y-4">
              <Calendar onChange={setSelectedDate} value={selectedDate} />
              <h3 className="text-md font-semibold">Seçilen Gün Puan Detayı ({selectedDate.toLocaleDateString()}):</h3>
              <ul className="list-disc list-inside">
                <li>Kilo değişimi: {dailyBreakdown.weight ?? 0} puan</li>
                <li>Yağ oranı: {dailyBreakdown.fat ?? 0} puan</li>
                <li>Beden değişimi: {dailyBreakdown.size ?? 0} puan</li>
                <li>Diyete uyum: {dailyBreakdown.diet ?? 0} puan</li>
                <li>Spor: {dailyBreakdown.exercise ?? 0} puan</li>
                <li>Su: {dailyBreakdown.water ?? 0} puan</li>
              </ul>
              <p className="font-bold mt-4">Toplam O Günlük Puan: {getDailyTotal(selectedDate.toISOString().split("T")[0])}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
